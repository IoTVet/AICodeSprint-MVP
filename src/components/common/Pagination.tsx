import React from 'react';
import styled from 'styled-components';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Button } from './Button';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
`;

const PageInfo = styled.span`
  margin: 0 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <PaginationContainer>
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        icon={<FiChevronLeft />}
      >
        Previous
      </Button>
      <PageInfo>
        Page {currentPage} of {totalPages}
      </PageInfo>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        icon={<FiChevronRight />}
      >
        Next
      </Button>
    </PaginationContainer>
  );
};

export default Pagination;