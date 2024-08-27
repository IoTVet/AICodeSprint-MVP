import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService, userService } from '../api/services/authService';


interface User {
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
  company?: {
    logo_url?:string;
    name?:string;
  }
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  handleUnauthorized: () => void;
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    company_name: string
  }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Fetch user data here if not stored in localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      console.log('Login response:', response);

      if (response.data && response.data.access) {
        localStorage.setItem('token', response.data.access);
        setIsAuthenticated(true);
        const userResponse = await userService.getCurrentUser(response.data.access);
        console.log(userResponse)
                // Assuming the login response includes user data
                const userData: User = {
                  email: userResponse.data.email,
                  first_name: userResponse.data.first_name,
                  last_name: userResponse.data.last_name,
                };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleUnauthorized = () => {
    logout();
    // We'll handle navigation in a separate hook
  };

  const register = async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    company_name: string
  }) => {
    try {
      const response = await authService.register(data);
      console.log('Register response:', response);

      if (response.data && response.data.message === 'User registered successfully') {
        // Registration successful, but user is not automatically logged in
        return;
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register, handleUnauthorized  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};