import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

const ErrorContainer = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.danger};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  margin: 2rem;
`;

const ErrorHeading = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  margin-bottom: 1rem;
`;

const ErrorStack = styled.pre`
  white-space: pre-wrap;
  font-size: 0.875rem;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 4px;
`;

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true, error: null, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorHeading>Oops! Something went wrong.</ErrorHeading>
          <ErrorMessage>{this.state.error && this.state.error.toString()}</ErrorMessage>
          <ErrorStack>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </ErrorStack>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;