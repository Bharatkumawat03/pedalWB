import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User, { IUser } from '../models/User';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: any;
  token: string;
}

class AuthService {
  async register(userData: RegisterData): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Password is already SHA-256 hashed from frontend
    // Hash it again with bcrypt before storing: bcrypt(SHA256(plain_password))
    const saltRounds = 12;
    const bcryptHashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Create user with bcrypt hashed password
    const user = await User.create({
      ...userData,
      password: bcryptHashedPassword
    });

    // Generate token
    const token = this.generateToken((user._id as any).toString());

    // Remove password from response
    const userObj = user.toObject();
    const { password: _, ...userResponse } = userObj;

    return {
      user: userResponse,
      token
    };
  }

  async login(loginData: LoginData): Promise<AuthResponse> {
    const { email, password } = loginData;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Password is already SHA-256 hashed from frontend
    // For new users: stored password is bcrypt(SHA256(plain_password))
    // For old users: stored password is bcrypt(plain_password) - need to handle migration
    // Try comparing SHA-256 hash with stored bcrypt hash (new format)
    let isPasswordValid = await bcrypt.compare(password, user.password);
    
    // If comparison fails, it might be an old password format
    // In that case, we can't verify without the plain password, so login fails
    // Users with old passwords will need to reset their password
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken((user._id as any).toString());

    // Remove password from response
    const userObj = user.toObject();
    const { password: _, ...userResponse } = userObj;

    return {
      user: userResponse,
      token
    };
  }

  async getCurrentUser(userId: string): Promise<any> {
    const user = await User.findById(userId).select('-password');
    return user;
  }

  async updateProfile(userId: string, updateData: Partial<IUser>): Promise<any> {
    // Remove password from update data if present
    const { password, ...safeUpdateData } = updateData;

    const user = await User.findByIdAndUpdate(
      userId,
      safeUpdateData,
      { new: true, runValidators: true }
    ).select('-password');

    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    // Passwords are already SHA-256 hashed from frontend
    // Verify current password (compare SHA-256 hash with stored bcrypt hash)
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password (SHA-256 hash) with bcrypt before storing
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Generate reset token
    const resetToken = this.generateResetToken();
    const resetTokenHash = await bcrypt.hash(resetToken, 10);

    // Save reset token to user (expires in 30 minutes)
    (user as any).passwordResetToken = resetTokenHash;
    (user as any).passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    return resetToken;
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<AuthResponse> {
    // Find user with valid reset token
    const users = await User.find({
      passwordResetExpires: { $gt: Date.now() }
    }).select('+passwordResetToken');

    let user = null;
    for (const u of users) {
      if ((u as any).passwordResetToken && await bcrypt.compare(resetToken, (u as any).passwordResetToken)) {
        user = u;
        break;
      }
    }

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Password is already SHA-256 hashed from frontend
    // Hash it again with bcrypt before storing
    const saltRounds = 12;
    user.password = await bcrypt.hash(newPassword, saltRounds);
    (user as any).passwordResetToken = undefined;
    (user as any).passwordResetExpires = undefined;
    await user.save();

    // Generate new auth token
    const token = this.generateToken((user._id as any).toString());

    // Remove password from response
    const userObj = user.toObject();
    const { password: _, ...userResponse } = userObj;

    return {
      user: userResponse,
      token
    };
  }

  async deleteAccount(userId: string): Promise<void> {
    await User.findByIdAndDelete(userId);
  }

  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    return jwt.sign({ id: userId }, secret, {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    } as jwt.SignOptions);
  }

  private generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  verifyToken(token: string): { id: string } {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    return jwt.verify(token, secret) as { id: string };
  }

  async googleAuth(tokenId: string): Promise<AuthResponse> {
    try {
      // Verify the Google token
      const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Invalid Google token');
      }

      const { sub: googleId, email, given_name: firstName, family_name: lastName, picture: avatar } = payload;

      if (!email) {
        throw new Error('Email not provided by Google');
      }

      // Check if user exists
      let user = await User.findOne({ 
        $or: [
          { email },
          { 'socialAuth.googleId': googleId }
        ]
      });

      if (user) {
        // User exists, update Google ID if not set
        if (!(user as any).socialAuth?.googleId) {
          (user as any).socialAuth = { ...(user.socialAuth || {}), googleId };
          if (avatar && !user.avatar) {
            user.avatar = { url: avatar };
          }
          await user.save();
        }
      } else {
        // Create new user
        user = await User.create({
          firstName: firstName || 'User',
          lastName: lastName || '',
          email,
          password: await bcrypt.hash(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), 12), // Random password
          avatar: avatar ? { url: avatar } : undefined,
          socialAuth: { googleId },
          emailVerified: true // Google emails are verified
        });
      }

      // Generate token
      const token = this.generateToken((user._id as any).toString());

      // Remove password from response
      const userObj = user.toObject();
      const { password: _, ...userResponse } = userObj;

      return {
        user: userResponse,
        token
      };
    } catch (error: any) {
      throw new Error(error.message || 'Google authentication failed');
    }
  }
}

export default new AuthService();