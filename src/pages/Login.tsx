// Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';

const LoginContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const InputWrapper = styled.div`
  margin-bottom: 1rem;
`;

const LoginButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
`;

const RegisterLink = styled(Link)`
  display: block;
  margin-top: 1rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  text-align: center;
  margin-top: 1rem;
`;

interface LocationState {
  from?: { pathname: string };
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If the user is already authenticated, redirect to the dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);

      // Safely access the 'from' property with a default value
      const state = location.state as LocationState;
      const from = state?.from?.pathname || '/dashboard';

      navigate(from);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  // If the user is authenticated, don't render the login form
  if (isAuthenticated) {
    return null;
  }

  return (
    <LoginContainer
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
    >
      <LoginForm onSubmit={handleSubmit}>
        <Title>Login</Title>
        <InputWrapper>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </InputWrapper>
        <LoginButton type="submit">Login</LoginButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <RegisterLink to="/register">Don't have an account? Register</RegisterLink>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;