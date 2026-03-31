export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}
