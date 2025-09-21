import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users as UsersIcon } from 'lucide-react';

const Users = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600">Manage customer accounts and permissions</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UsersIcon className="h-5 w-5 mr-2" />
            User Management
          </CardTitle>
          <CardDescription>
            View and manage customer accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">User Management Coming Soon</h3>
            <p className="text-gray-500">User management functionality will be implemented here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
