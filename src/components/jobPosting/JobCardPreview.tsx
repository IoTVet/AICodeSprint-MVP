// src/components/jobPosting/JobCardPreview.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FiCalendar, FiBriefcase, FiMapPin, FiUsers, FiDollarSign } from 'react-icons/fi';
import { JobPosting } from '../../api/types';
import styled from 'styled-components';

const PreviewCard = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
`;

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const JobTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
`;

const StatusBadge = styled.span<{ isActive: boolean }>`
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${props => props.isActive ? '#9AE6B4' : '#FEB2B2'};
  color: ${props => props.isActive ? '#22543D' : '#742A2A'};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #4A5568;

  svg {
    margin-right: 0.5rem;
    color: #3182CE;
  }
`;

const ApplicantPreview = styled.div`
  background-color: #EBF8FF;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ApplicantCount = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2B6CB0;
`;

const ApplicantLabel = styled.span`
  font-size: 0.875rem;
  color: #4A5568;
`;

interface JobCardPreviewProps {
  job: JobPosting;
  totalApplicants: number | null;
}

const JobCardPreview: React.FC<JobCardPreviewProps> = ({ job, totalApplicants }) => {
  const isActive = new Date(job.deadline) > new Date();

  return (
    <PreviewCard>
      <div>
        <JobHeader>
          <JobTitle>{job.title}</JobTitle>
          <StatusBadge isActive={isActive}>
            {isActive ? 'Active' : 'Closed'}
          </StatusBadge>
        </JobHeader>
        <InfoGrid>
          <InfoItem>
            <FiBriefcase />
            {job.company.name}
          </InfoItem>
          <InfoItem>
            <FiMapPin />
            {job.location || 'Remote'}
          </InfoItem>
          <InfoItem>
            <FiCalendar />
            Posted: {format(new Date(job.created_at), 'MMM d, yyyy')}
          </InfoItem>
          <InfoItem>
            <FiCalendar />
            Deadline: {format(new Date(job.deadline), 'MMM d, yyyy')}
          </InfoItem>
          <InfoItem>
            <FiDollarSign />
            {job.salary_range || 'Competitive'}
          </InfoItem>
        </InfoGrid>
      </div>
      <ApplicantPreview>
        <ApplicantCount>{totalApplicants !== null ? totalApplicants : '-'}</ApplicantCount>
        <ApplicantLabel>Applicants</ApplicantLabel>
      </ApplicantPreview>
    </PreviewCard>
  );
};

export default JobCardPreview;