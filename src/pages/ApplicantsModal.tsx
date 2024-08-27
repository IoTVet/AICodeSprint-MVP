import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import FilterBar from "../components/common/FilterBar"
import  Pagination  from '../components/common/Pagination';
import { applicantService } from '../api/services/jobPostingService';
import { JobPosting, Applicant } from '../api/types';
import usePaginatedData from '../hooks/usePaginatedData';
import LoadingAnimation from '../components/common/LoadingAnimation';
import MiniLoadingAnimation from '../components/common/MiniLoadingAnimation';

const ApplicantList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const ApplicantItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ApplicantInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ApplicantName = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textDark};
`;

const ApplicantEmail = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
`;

const ApplicantStatus = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case 'applied':
        return theme.colors.primary;
      case 'interviewed':
        return theme.colors.success;
      case 'rejected':
        return theme.colors.danger;
      default:
        return theme.colors.secondary;
    }
  }};
  color: white;
`;

interface ApplicantsModalProps {
  jobPosting: JobPosting;
  onClose: () => void;
}

const ApplicantsModal: React.FC<ApplicantsModalProps> = ({ jobPosting, onClose }) => {
  const {
    data: applicants,
    loading,
    error,
    page,
    totalPages,
    search,
    ordering,
    setPage,
    setSearch,
    setOrdering,
  } = usePaginatedData<Applicant>({
    fetchFunction: (params) => applicantService.getAll(jobPosting.id, params),
    initialOrdering: '-applied_at',
  });

  const filterOptions = [
    { label: 'All', value: '' },
    { label: 'Applied', value: 'applied' },
    { label: 'Interviewed', value: 'interviewed' },
    { label: 'Rejected', value: 'rejected' },
  ];

  const sortOptions = [
    { label: 'Newest', value: '-applied_at' },
    { label: 'Oldest', value: 'applied_at' },
    { label: 'Name A-Z', value: 'last_name' },
    { label: 'Name Z-A', value: '-last_name' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState(filterOptions[0].value);
  const [sortValue, setSortValue] = useState(sortOptions[0].value);
  const [isAdvancedFilterModalOpen, setIsAdvancedFilterModalOpen] = useState(false);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Applicants for ${jobPosting.title}`}
    >
         <FilterBar
          searchPlaceholder="Search applicants..."
          filterOptions={filterOptions}
          sortOptions={sortOptions}
          onSearch={(value) => {
            setSearchTerm(value);
            setSearch(value);
          }}
          onFilter={(value) => {
            setFilterValue(value);
            setSearch(value ? `status=${value}` : '');
          }}
          onSort={(value) => {
            setSortValue(value);
            setOrdering(value);
          }}
          onClearFilters={() => {
            setSearchTerm('');
            setFilterValue(filterOptions[0].value);
            setSortValue(sortOptions[0].value);
            setSearch('');
            setOrdering('-created_at');
          }}
          onAdvancedFilters={() => setIsAdvancedFilterModalOpen(true)}
          currentSearchTerm={searchTerm}
          currentFilterValue={filterValue}
          currentSortValue={sortValue}
        />
      {loading && <MiniLoadingAnimation />}
      {error && <p>Error: {error.message}</p>}
      <ApplicantList>
        {applicants.map((applicant) => (
          <ApplicantItem key={applicant.id}>
            <ApplicantInfo>
              <ApplicantName>{`${applicant.first_name} ${applicant.last_name}`}</ApplicantName>
              <ApplicantEmail>{applicant.email}</ApplicantEmail>
            </ApplicantInfo>
            <ApplicantStatus status={applicant.status}>
              {applicant.status}
            </ApplicantStatus>
            <Button variant="secondary" onClick={() => console.log('View evaluation')}>
              View Evaluation
            </Button>
          </ApplicantItem>
        ))}
      </ApplicantList>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </Modal>
  );
};

export default ApplicantsModal;