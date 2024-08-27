import React from 'react';
import styled from 'styled-components';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const StyledLabel = styled.label`
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: ${({ theme }) => theme.colors.textDark};
`;

const StyledTextarea = styled.textarea<{ hasError?: boolean }>`
  padding: 0.5rem;
  border: 1px solid ${({ theme, hasError }) => hasError ? theme.colors.danger : theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.danger};
  margin-top: 0.25rem;
`;

export const Textarea: React.FC<TextareaProps> = ({ label, error, ...props }) => {
  return (
    <TextareaWrapper>
      {label && <StyledLabel>{label}</StyledLabel>}
      <StyledTextarea hasError={!!error} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </TextareaWrapper>
  );
};