import axios from 'axios';
import { LoginCredentials, LoginResponse, UpdateUserData, User, UsersResponse } from '../types';

const BASE_URL = 'https://reqres.in/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/login', credentials);
  return response.data;
};

export const getUsers = async (page: number = 1): Promise<UsersResponse> => {
  const response = await api.get<UsersResponse>(`/users?page=${page}&per_page=6`);
  return response.data;
};

export const updateUser = async (id: number, data: UpdateUserData): Promise<User> => {
  try {
    const response = await api.put<{ data: User }>(`/users/${id}`, data);
    // Since the mock API doesn't actually update the user, we'll simulate a successful response
    return {
      id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      avatar: `https://reqres.in/img/faces/${id}-image.jpg`, // Keep the existing avatar
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.delete(`/users/${id}`);
    // The mock API returns 204 No Content for successful deletion
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}; 