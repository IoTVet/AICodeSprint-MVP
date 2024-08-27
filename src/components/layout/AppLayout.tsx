import React from 'react';
import styled from 'styled-components';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { Outlet } from 'react-router-dom';
import {Box} from "@chakra-ui/react";

const LayoutWrapper = styled.div`
  display: grid;
  grid-template-areas:
    "sidebar header"
    "sidebar main"
    "sidebar footer";
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
`;

const Main = styled.main`
  grid-area: main;
  padding: 2rem;
  overflow-y: auto;
`;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <LayoutWrapper>
      <Sidebar />
        <Box ml={{ base: 0, md: '80px' }} transition="margin-left 0.3s">
      <Main>{children || <Outlet />}</Main>
      <Footer />
            </Box>
    </LayoutWrapper>
  );
};

export default AppLayout;