import React from 'react';
import styled, { keyframes } from 'styled-components';
import LoadingAnimation from './LoadingAnimation';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const SpinnerContainer = styled.div`
  width: 50px;
  height: 50px;
`;

const Spinner = styled.div`
  width: 100%;
  height: 100%;
  border: 5px solid ${({ theme }) => theme.colors.backgroundLight};
  border-top: 5px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const Loader: React.FC = () => {
  return (
    <LoaderWrapper>
   <LoadingAnimation />
    </LoaderWrapper>
  );
};