import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  touched?: boolean;
}

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const StyledLabel = styled(motion.label)`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textDark};
  margin-bottom: 0.25rem;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid ${({ theme, hasError }) => hasError ? theme.colors.danger : theme.colors.border};
  border-radius: 8px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }

  ${({ type }) => type === 'password' && css`
    padding-right: 2.5rem;
  `}
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorMessage = styled(motion.span)`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.danger};
  margin-top: 0.25rem;
`;

const PasswordToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  error,
  touched,
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <InputWrapper>
      <AnimatePresence>
        {label && (
          <StyledLabel
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
          >
            {label}
          </StyledLabel>
        )}
      </AnimatePresence>
      <InputContainer>
        <StyledInput
          type={showPassword ? 'text' : type}
          hasError={touched && !!error}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {icon && <IconWrapper>{icon}</IconWrapper>}
        {type === 'password' && (
          <PasswordToggle onClick={togglePasswordVisibility} type="button">
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </PasswordToggle>
        )}
      </InputContainer>
      <AnimatePresence>
        {touched && error && (
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </ErrorMessage>
        )}
      </AnimatePresence>
    </InputWrapper>
  );
};