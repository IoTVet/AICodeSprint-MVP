import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FooterWrapper = styled(motion.footer)`
  grid-area: footer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const Copyright = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const FooterLink = styled.a`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const footerVariants = {
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export const Footer: React.FC = () => {
  return (
    <FooterWrapper variants={footerVariants} initial="initial" animate="animate">
      <Copyright>&copy; 2024 Your Company. All rights reserved.</Copyright>
      <FooterLinks>
        <FooterLink href="/privacy">Privacy Policy</FooterLink>
        <FooterLink href="/terms">Terms of Service</FooterLink>
        <FooterLink href="/contact">Contact Us</FooterLink>
      </FooterLinks>
    </FooterWrapper>
  );
};