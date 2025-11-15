import User, { IUser, IAddress } from '../models/User';

export interface UserQuery {
  search?: string;
  role?: string;
  isActive?: boolean;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface UserResponse {
  users: Omit<IUser, 'password'>[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    pages: number;
  };
}

class UserService {
  async getUsers(query: UserQuery, pagination: PaginationOptions): Promise<UserResponse> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    // Build MongoDB query
    const mongoQuery: any = {};

    // Search by name or email
    if (query.search) {
      mongoQuery.$or = [
        { firstName: { $regex: query.search, $options: 'i' } },
        { lastName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } }
      ];
    }

    // Filter by role
    if (query.role) {
      mongoQuery.role = query.role;
    }

    // Filter by active status
    if (query.isActive !== undefined) {
      mongoQuery.isActive = query.isActive;
    }

    const users = await User.find(mongoQuery)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(mongoQuery);

    return {
      users,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getUserById(id: string): Promise<Omit<IUser, 'password'> | null> {
    return await User.findById(id).select('-password');
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<Omit<IUser, 'password'> | null> {
    // Remove password from update data if present
    const { password, ...safeUpdateData } = updateData;

    return await User.findByIdAndUpdate(
      id,
      safeUpdateData,
      { new: true, runValidators: true }
    ).select('-password');
  }

  async deleteUser(id: string): Promise<Omit<IUser, 'password'> | null> {
    return await User.findByIdAndDelete(id).select('-password');
  }

  async deactivateUser(id: string): Promise<Omit<IUser, 'password'> | null> {
    return await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select('-password');
  }

  async activateUser(id: string): Promise<Omit<IUser, 'password'> | null> {
    return await User.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    ).select('-password');
  }

  // Address management
  async getUserAddresses(userId: string): Promise<IAddress[]> {
    const user = await User.findById(userId).select('addresses');
    return user?.addresses || [];
  }

  async addUserAddress(userId: string, addressData: Omit<IAddress, '_id'>): Promise<IAddress[]> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // If this is the first address or marked as default, make it default
    if (user.addresses.length === 0 || addressData.isDefault) {
      // Remove default from other addresses
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push(addressData as any);
    await user.save();

    return user.addresses;
  }

  async updateUserAddress(
    userId: string, 
    addressId: string, 
    addressData: Partial<IAddress>
  ): Promise<IAddress[]> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      throw new Error('Address not found');
    }

    // If setting as default, remove default from other addresses
    if (addressData.isDefault) {
      user.addresses.forEach(addr => {
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false;
        }
      });
    }

    // Update address fields
    Object.assign(address, addressData);
    await user.save();

    return user.addresses;
  }

  async deleteUserAddress(userId: string, addressId: string): Promise<IAddress[]> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      throw new Error('Address not found');
    }

    const wasDefault = address.isDefault;
    address.deleteOne();

    // If deleted address was default, make the first remaining address default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    return user.addresses;
  }

  async getUserStats(userId: string): Promise<{
    totalOrders: number;
    totalSpent: number;
    cartItems: number;
    wishlistItems: number;
    joinDate: Date;
  }> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Note: This would need Order model integration for totalOrders and totalSpent
    // For now, return basic stats
    return {
      totalOrders: 0, // Would need Order.countDocuments({ user: userId })
      totalSpent: 0,  // Would need Order aggregation
      cartItems: user.cart.length,
      wishlistItems: user.wishlist.length,
      joinDate: user.createdAt
    };
  }
}

export default new UserService();