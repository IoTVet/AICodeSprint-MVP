import React from 'react';
import styled, { css } from 'styled-components';
import { motion, Variants } from 'framer-motion';
import { darken, lighten } from 'polished';
import LoadingAnimation from './LoadingAnimation';
import MiniLoadingAnimation from './MiniLoadingAnimation';

type ButtonSize = 'small' | 'medium' | 'large';
type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const ButtonWrapper = styled(motion.button)<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  ${({ fullWidth }) => fullWidth && css`width: 100%;`}

  ${({ size }) => {
    switch (size) {
      case 'small':
        return css`
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        `;
      case 'large':
        return css`
          padding: 1rem 2rem;
          font-size: 1.125rem;
        `;
      default:
        return css`
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
        `;
    }
  }}

  ${({ variant, theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.white};
          &:hover {
            background-color: ${darken(0.1, theme.colors.secondary)};
          }
        `;
      case 'tertiary':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};
          &:hover {
            background-color: ${lighten(0.4, theme.colors.primary)};
          }
        `;
      case 'danger':
        return css`
          background-color: ${theme.colors.danger};
          color: ${theme.colors.white};
          &:hover {
            background-color: ${darken(0.1, theme.colors.danger)};
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.white};
          &:hover {
            background-color: ${darken(0.1, theme.colors.primary)};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const IconWrapper = styled.span`
  margin-right: 0.5rem;
`;

const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export const Button: React.FC<ButtonProps> = ({
  children,
  size = 'medium',
  variant = 'primary',
  isLoading = false,
  icon,
  fullWidth = false,
  ...props
}) => {
  return (
    <ButtonWrapper
      size={size}
      variant={variant}
      fullWidth={fullWidth}
      disabled={isLoading || props.disabled}
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {isLoading && (
        <MiniLoadingAnimation />
      )}
      {!isLoading && icon && <IconWrapper>{icon}</IconWrapper>}
      {!isLoading && children}
    </ButtonWrapper>
  );
};