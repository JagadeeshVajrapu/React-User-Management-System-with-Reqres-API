import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser, updateUser } from '../services/api';
import { User, UpdateUserData } from '../types';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

export default function Users() {
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const { register, handleSubmit, reset } = useForm<UpdateUserData>();

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', page],
    queryFn: () => getUsers(page),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete user');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserData }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditingUser(null);
      toast.success('User updated successfully');
    },
    onError: () => {
      toast.error('Failed to update user');
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    reset({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  };

  const onSubmit = (data: UpdateUserData) => {
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {editingUser && (
          <div className="mb-8 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit User</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <input
                        {...register('first_name', { required: true })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        {...register('last_name', { required: true })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      {...register('email', { required: true })}
                      type="email"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {usersData?.data.map((user) => (
            <div
              key={user.id}
              className="bg-white overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={user.avatar}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => handleEdit(user)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {usersData && (
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
              Page {page} of {usersData.total_pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(usersData.total_pages, p + 1))}
              disabled={page === usersData.total_pages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 