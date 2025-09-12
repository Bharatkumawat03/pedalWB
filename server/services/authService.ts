import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

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
  user: Omit<IUser, 'password'>;
  token: string;
}

class AuthService {
  async register(userData: RegisterData): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create user
    const user = await User.create(userData);

    // Generate token
    const token = this.generateToken(user._id.toString());

    // Remove password from response
    const { password, ...userResponse } = user.toObject();

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

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user._id.toString());

    // Remove password from response
    const { password, ...userResponse } = user.toObject();

    return {
      user: userResponse,
      token
    };
  }

  async getCurrentUser(userId: string): Promise<Omit<IUser, 'password'> | null> {
    const user = await User.findById(userId).select('-password');
    return user;
  }

  async updateProfile(userId: string, updateData: Partial<IUser>): Promise<Omit<IUser, 'password'> | null> {
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

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
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

    // Hash new password
    const saltRounds = 12;
    user.password = await bcrypt.hash(newPassword, saltRounds);
    (user as any).passwordResetToken = undefined;
    (user as any).passwordResetExpires = undefined;
    await user.save();

    // Generate new auth token
    const token = this.generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      user: userResponse,
      token
    };
  }

  async deleteAccount(userId: string): Promise<void> {
    await User.findByIdAndDelete(userId);
  }

  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key';
    return jwt.sign({ id: userId }, secret, {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    });
  }

  private generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  verifyToken(token: string): { id: string } {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key';
    return jwt.verify(token, secret) as { id: string };
  }
}

export default new AuthService();