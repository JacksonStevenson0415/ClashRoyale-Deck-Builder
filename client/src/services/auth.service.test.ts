import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';

vi.mock('./api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('auth.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('calls POST /auth/register with email, username, and password', async () => {
      vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
      const { register } = await import('./auth.service');

      await register('test@example.com', 'testuser', 'password123');

      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      });
    });
  });

  describe('login', () => {
    it('calls POST /auth/login with email and password', async () => {
      vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
      const { login } = await import('./auth.service');

      await login('test@example.com', 'password123');

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('getMe', () => {
    it('calls GET /auth/me', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: {} });
      const { getMe } = await import('./auth.service');

      await getMe();

      expect(api.get).toHaveBeenCalledWith('/auth/me');
    });
  });
});
