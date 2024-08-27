// src/components/jobPosting/JobCardExpanded.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { JobPosting, Applicant } from '../../api/types';
import styled from 'styled-components';
import { FiUser, FiMail, FiCalendar } from 'react-icons/fi';

const ExpandedCard = styled(motion.div)`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 0.5rem;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  font-size: 0.875rem;
  color: #4A5568;
  margin-bottom: 0.25rem;
`;

const ApplicantList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const ApplicantCard = styled.div`
  background-color: #EDF2F7;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.5rem;
`;

const ApplicantInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;

  svg {
    margin-right: 0.5rem;
    color: #3182CE;
  }
`;

interface JobCardExpandedProps {
  job: JobPosting;
  applicants: Applicant[];
}

const JobCardExpanded: React.FC<JobCardExpandedProps> = ({ job, applicants }) => {
  return (
    <ExpandedCard
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <Section>
          <SectionTitle>Job Overview</SectionTitle>
          <List>
            {job.ijd_info.jobOverview.map((item, index) => (
              <ListItem key={index}>{item}</ListItem>
            ))}
          </List>
        </Section>
        <Section>
          <SectionTitle>About the Organization</SectionTitle>
          <List>
            {job.ijd_info.aboutTheOrg.map((item, index) => (
              <ListItem key={index}>{item}</ListItem>
            ))}
          </List>
        </Section>
        <Section>
          <SectionTitle>Job Requirements</SectionTitle>
          <List>
            {job.ijd_info.jobRequirements.map((item, index) => (
              <ListItem key={index}>{item}</ListItem>
            ))}
          </List>
        </Section>
      </div>
      <div>
        <Section>
          <SectionTitle>Job Responsibilities</SectionTitle>
          <List>
            {job.ijd_info.jobResponsibilities.map((item, index) => (
              <ListItem key={index}>{item}</ListItem>
            ))}
          </List>
        </Section>
        <Section>
          <SectionTitle>Compensation</SectionTitle>
          <List>
            {job.ijd_info.compensation.map((item, index) => (
              <ListItem key={index}>{item}</ListItem>
            ))}
          </List>
        </Section>
        <Section>
          <SectionTitle>Recent Applicants</SectionTitle>
          <ApplicantList>
            {applicants.slice(0, 5).map((applicant) => (
              <ApplicantCard key={applicant.id}>
                <ApplicantInfo>
                  <FiUser />
                  {applicant.first_name} {applicant.last_name}
                </ApplicantInfo>
                <ApplicantInfo>
                  <FiMail />
                  {applicant.email}
                </ApplicantInfo>
                <ApplicantInfo>
                  <FiCalendar />
                  Applied: {new Date(applicant.applied_at).toLocaleDateString()}
                </ApplicantInfo>
              </ApplicantCard>
            ))}
          </ApplicantList>
        </Section>
      </div>
    </ExpandedCard>
  );
};

export default JobCardExpanded;