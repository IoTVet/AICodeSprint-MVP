import React from 'react';
import styled from 'styled-components';
import { motion, Variants } from 'framer-motion';

interface CardProps {
  title?: string;
  subtitle?: string;
  hoverable?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const CardWrapper = styled(motion.div)<{ $hoverable: boolean }>`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  ${({ $hoverable }) => $hoverable && `
    cursor: pointer;
    &:hover {
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    }
  `}
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: ${({ theme }) => theme.colors.textDark};
`;

const CardSubtitle = styled.h4`
  font-size: 1rem;
  font-weight: 400;
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CardContent = styled.div`
  color: ${({ theme }) => theme.colors.text};
`;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  hoverable = false,
  onClick,
  children,
}) => {
  return (
    <CardWrapper
      $hoverable={hoverable}
      onClick={onClick}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverable ? "hover" : undefined}
      whileTap={hoverable ? "tap" : undefined}
    >
      {title && <CardTitle>{title}</CardTitle>}
      {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
      <CardContent>{children}</CardContent>
    </CardWrapper>
  );
};