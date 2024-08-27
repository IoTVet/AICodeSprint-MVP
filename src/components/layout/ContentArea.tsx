import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface ContentAreaProps {
  children: React.ReactNode;
}

const ContentWrapper = styled(motion.main)`
  grid-area: main;
  padding: 2rem;
  overflow-y: auto;
`;

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export const ContentArea: React.FC<ContentAreaProps> = ({ children }) => {
  return (
    <ContentWrapper
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </ContentWrapper>
  );
};