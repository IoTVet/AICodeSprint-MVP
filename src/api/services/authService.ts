import client from '../client';

export const authService = {
  login: async (email: string, password: string) => {
    // Mock response to bypass actual login
    localStorage.setItem('token', 'mock-access-token');
    return Promise.resolve({
      data: { access: 'mock-access-token' }, // Providing 'access' as expected
    });
  },
  register: async (data: { email: string; password: string; first_name: string; last_name: string; company_name: string }) => {
    // Mock register response
    return Promise.resolve({
      data: { message: 'User registered successfully' }, // Providing 'message' as expected
    });
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

export const userService = {
  getCurrentUser: async (token: string) => {
    // Mock user data
    return Promise.resolve({
      data: {
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        company_name: 'Test Company',
      },
    });
  },
};
