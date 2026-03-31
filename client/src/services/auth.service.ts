import api from './api';
import { AuthResponse, User } from '../types/auth.types';

export const register = (email: string, username: string, password: string) =>
  api.post<AuthResponse>('/auth/register', { email, username, password });

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password });

export const getMe = () =>
  api.get<User>('/auth/me');
