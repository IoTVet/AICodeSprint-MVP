// src/components/layout/PublicLayout.tsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <Box minHeight="100vh" width="100vw">
      {children || <Outlet />}
    </Box>
  );
};

export default PublicLayout;