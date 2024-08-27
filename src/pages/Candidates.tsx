import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card } from '../components/common/Card';
import { Dropdown } from '../components/common/Dropdown';
import { Button, Box } from '@chakra-ui/react';

const JobHomePageContainer = styled(motion.div)`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  padding: 2rem;
`;

const SectionHeading = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const JobHomePage: React.FC = () => {
  const stakeholders = [
    { label: 'Hiring Manager', value: 'hiring-manager' },
    { label: 'Recruiter', value: 'recruiter' },
    { label: 'HR Specialist', value: 'hr-specialist' }
  ];

  return (
    <JobHomePageContainer
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Job Setup & Management Section */}
      <Card title="Job Setup & Management">
        <SectionHeading>Assign & Manage Stakeholders</SectionHeading>
        <Dropdown
          items={stakeholders}
          placeholder="Select Stakeholders"
          onChange={(value) => console.log('Selected stakeholder:', value)}
        />
        <Box mt={4}>
          <Button>Assign Stakeholders</Button>
        </Box>
      </Card>

      <Card title="Job Description">
        <SectionHeading>Create or Upload Job Description</SectionHeading>
        <Box mt={4}>
          <Button>Create Job Description</Button>
        </Box>
        <Box mt={4}>
          <Button>Upload Job Description</Button>
        </Box>
      </Card>

      {/* Application Management Section */}
      <Card title="Application Management">
        <SectionHeading>Automated Job Posting</SectionHeading>
        <Box mt={4}>
          <Button>Automate Job Posting</Button>
        </Box>
      </Card>

      <Card title="Applicant Matching">
        <SectionHeading>Applicant Matching & Ranking</SectionHeading>
        <Box mt={4}>
          <Button>View Matches</Button>
        </Box>
      </Card>

      {/* Candidate Review & Submission Section */}
      <Card title="Candidate Review">
        <SectionHeading>Submit to Hiring Manager</SectionHeading>
        <Box mt={4}>
          <Button>Submit Candidates</Button>
        </Box>
      </Card>

      {/* Analytics & Insights Section */}
      <Card title="Job Performance">
        <SectionHeading>Job Performance Dashboard</SectionHeading>
        <Box mt={4}>
          <Button>View Dashboard</Button>
        </Box>
      </Card>

      <Card title="Bench Application">
        <SectionHeading>Bench Application (Upsell)</SectionHeading>
        <Box mt={4}>
          <Button variant="outline">Learn More</Button>
        </Box>
      </Card>
    </JobHomePageContainer>
  );
};

export default JobHomePage;