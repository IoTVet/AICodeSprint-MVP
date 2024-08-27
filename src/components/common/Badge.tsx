import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface BadgeProps {
  content: string | number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

const BadgeContainer = styled(motion.span)<{ variant: string; size: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  font-weight: 600;

  ${({ variant, theme }) => {
    switch (variant) {
      case 'secondary':
        return `
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.white};
        `;
      case 'success':
        return `
          background-color: ${theme.colors.success};
          color: ${theme.colors.white};
        `;
      case 'warning':
        return `
          background-color: ${theme.colors.warning};
          color: ${theme.colors.textDark};
        `;
      case 'danger':
        return `
          background-color: ${theme.colors.danger};
          color: ${theme.colors.white};
        `;
      default:
        return `
          background-color: ${theme.colors.primary};
          color: ${theme.colors.white};
        `;
    }
  }}

  ${({ size }) => {
    switch (size) {
      case 'small':
        return `
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
          min-width: 1.5rem;
          height: 1.5rem;
        `;
      case 'large':
        return `
          font-size: 1rem;
          padding: 0.4rem 0.8rem;
          min-width: 2.5rem;
          height: 2.5rem;
        `;
      default:
        return `
          font-size: 0.875rem;
          padding: 0.3rem 0.6rem;
          min-width: 2rem;
          height: 2rem;
        `;
    }
  }}
`;

const badgeVariants = {
  initial: { scale: 0 },
  animate: { scale: 1, transition: { type: 'spring', stiffness: 500, damping: 30 } },
  exit: { scale: 0, transition: { duration: 0.2 } },
};

export const Badge: React.FC<BadgeProps> = ({
  content,
  variant = 'primary',
  size = 'medium',
}) => {
  return (
    <BadgeContainer
      variant={variant}
      size={size}
      variants={badgeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {content}
    </BadgeContainer>
  );
};