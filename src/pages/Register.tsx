import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import login from "./Login";

const RegisterContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const RegisterForm = styled.form`
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

const RegisterButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
`;

const LoginLink = styled(Link)`
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

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  if (password !== confirmPassword) {
    setError('Passwords do not match');
    return;
  }

  try {
    // Attempt to register the user
    await register({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      company_name: companyName
    });

    // If registration is successful, attempt to log in
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (loginErr) {
      console.error('Login error after registration:', loginErr);
      setError('Registration successful, but unable to log in. Please try logging in manually.');
      navigate('/login');
    }
  } catch (err) {
    console.error('Registration error:', err);
    setError('Error registering. Please try again.');
  }
};

  return (
    <RegisterContainer
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
    >
      <RegisterForm onSubmit={handleSubmit}>
        <Title>Register</Title>
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
        <InputWrapper>
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </InputWrapper>
        <RegisterButton type="submit">Register</RegisterButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <LoginLink to="/login">Already have an account? Login</LoginLink>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default Register;