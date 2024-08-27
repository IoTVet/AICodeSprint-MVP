import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card } from '../components/common/Card';
import { Dropdown } from '../components/common/Dropdown';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Box, Table, Tbody, Tr, Td, Text, CircularProgress, CircularProgressLabel, Image, IconButton, Avatar, Button, Tooltip } from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import CountUp from 'react-countup';

const AnalyticsContainer = styled(motion.div)`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  padding: 2rem;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const ApplicantsTableContainer = styled(Box)`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 33vh; /* 1/3 of the viewport height */
  overflow-y: hidden;
  background-color: ${({ theme }) => theme.colors?.background || '#f7f7f7'};
  border-top: 1px solid ${({ theme }) => theme.colors?.border || '#ccc'};
  padding: 1rem;
`;

const ApplicantRow = styled(Tr)`
  background-color: white;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#ddd'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
  overflow: hidden;
`;

const ApplicantData = styled(Td)`
  padding: 1rem;
  vertical-align: middle;
`;

const RankPercentageContainer = styled(Box)`
  display: flex;
  align-items: center;
`;

const SourceLogo = styled(Image)`
  height: 20px;
  margin-right: 8px;
`;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const Analytics: React.FC = () => {
  const [visibleRows, setVisibleRows] = useState(0);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    // Delay the animation by 2 seconds after the page loads
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 2000);

    // Trigger the spin-up animation after an additional delay
    setTimeout(() => {
      setShouldAnimate(true);
    }, 3000);
  }, []);

  const timeRanges = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 3 months', value: '3m' },
    { label: 'Last year', value: '1y' },
  ];

  const applicationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Applications',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const hiringFunnelData = {
    labels: ['Applied', 'Screened', 'Interviewed', 'Offered', 'Hired'],
    datasets: [
      {
        data: [1000, 800, 400, 200, 100],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  const timeToHireData = {
    labels: ['Engineering', 'Product', 'Design', 'Marketing', 'Sales'],
    datasets: [
      {
        label: 'Average Days to Hire',
        data: [45, 38, 42, 31, 35],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // Applicants data
  const applicants = [
    {
      id: 1,
      name: 'John Doe',
      position: 'Software Engineer',
      status: 'Applied',
      source: 'Career Page',
      sourceLogo: 'https://img.freepik.com/premium-vector/logo-company-called-your-tagline_674761-1004.jpg?w=360',
      sourceLink: 'https://www.company-career-page.com',
      ranking: 'A',
      rankPercentage: 85,
      lastActivityDate: 'July 20, 2024',
      recruiterNotes: 'Great experience in backend development.',
      avatar: 'http://ceaprimary.com/wp-content/uploads/learn-press-profile/4/172522ec1028ab781d9dfd17eaca4427.jpg',
    },
    {
      id: 2,
      name: 'Jane Smith',
      position: 'Product Manager',
      status: 'Submitted',
      source: 'LinkedIn',
      sourceLogo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
      sourceLink: 'https://www.linkedin.com',
      ranking: 'B',
      rankPercentage: 78,
      lastActivityDate: 'July 22, 2024',
      recruiterNotes: 'Strong leadership and communication skills.',
      avatar: 'https://sist.ac.ke/wp-content/uploads/2017/12/instructor5.jpg',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      position: 'UX Designer',
      status: 'Rejected',
      source: 'Indeed',
      sourceLogo: 'https://d34k7i5akwhqbd.cloudfront.net/allspark/static/images/indeed-share-image-9581a8.png',
      sourceLink: 'https://www.indeed.com',
      ranking: 'C',
      rankPercentage: 67,
      lastActivityDate: 'July 23, 2024',
      recruiterNotes: 'Good design skills, but lacks relevant industry experience.',
      avatar: 'https://globalnews.ca/news/2614817/mike-smith-of-the-trailer-park-boys-arrested-in-l-a/',
    },
  ];

  // Determine colors based on rank percentage
  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'gold';
      case 1:
        return 'silver';
      case 2:
        return 'bronze';
      default:
        return 'teal.500';
    }
  };

  const handleSlideUp = () => {
    if (visibleRows > 0) {
      setVisibleRows(visibleRows - 1);
    }
  };

  const handleSlideDown = () => {
    if (visibleRows < applicants.length - 1) {
      setVisibleRows(visibleRows + 1);
    }
  };

  return (
    <>
      <AnalyticsContainer
        variants={pageVariants}
        initial="initial"
        animate={isPageLoaded ? 'animate' : 'initial'}
        exit="exit"
      >
        <FilterContainer>
          <Dropdown
            items={timeRanges}
            onChange={(value) => console.log('Selected time range:', value)}
            placeholder="Select time range"
          />
        </FilterContainer>
        <Card title="Application Trend">
          <Line
            data={applicationData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' as const },
                title: { display: true, text: 'Application Trend' },
              },
            }}
          />
        </Card>
        <Card title="Hiring Funnel">
          <Doughnut
            data={hiringFunnelData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'right' as const },
                title: { display: true, text: 'Hiring Funnel' },
              },
            }}
          />
        </Card>
        <Card title="Time to Hire by Department">
          <Bar
            data={timeToHireData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' as const },
                title: { display: true, text: 'Time to Hire by Department' },
              },
            }}
          />
        </Card>
      </AnalyticsContainer>

      {/* Applicants Table */}
      <ApplicantsTableContainer>
        <IconButton
          icon={<ChevronUpIcon />}
          aria-label="Slide up"
          onClick={handleSlideUp}
          position="absolute"
          right="1rem"
          top="1rem"
        />
        <Table variant="unstyled" size="md">
          <Tbody>
            {applicants.slice(visibleRows, visibleRows + 3).map((applicant, index) => (
              <ApplicantRow key={applicant.id}>
                <ApplicantData>
                  <Avatar src={applicant.avatar} size="md" name={applicant.name} mr={4} />
                  <Box>
                    <Text fontWeight="bold">{applicant.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {applicant.position}
                    </Text>
                  </Box>
                </ApplicantData>
                <ApplicantData>
                  <Text fontSize="sm" color="gray.500">
                    {applicant.lastActivityDate}
                  </Text>
                </ApplicantData>
                <ApplicantData>
                  <RankPercentageContainer>
                    <a href={applicant.sourceLink} target="_blank" rel="noopener noreferrer">
                      <SourceLogo src={applicant.sourceLogo} alt={applicant.source} />
                    </a>
                    <Text fontSize="sm" color="gray.500">
                      {applicant.source}
                    </Text>
                  </RankPercentageContainer>
                </ApplicantData>
                <ApplicantData>
                  <Text fontSize="sm" color={applicant.status === 'Rejected' ? 'red.500' : 'green.500'}>
                    {applicant.status}
                  </Text>
                </ApplicantData>
                <ApplicantData>
                  <RankPercentageContainer>
                    <CircularProgress
                      value={shouldAnimate ? applicant.rankPercentage : 0}
                      size="60px"
                      thickness="10px"
                      color={getRankColor(index)}
                    >
                      <CircularProgressLabel fontSize="lg">
                        <CountUp
                          start={0}
                          end={shouldAnimate ? applicant.rankPercentage : 0}
                          duration={3} /* Slower animation duration */
                        />
                        %
                      </CircularProgressLabel>
                    </CircularProgress>
                  </RankPercentageContainer>
                </ApplicantData>
                <ApplicantData>
                  <Tooltip label={applicant.recruiterNotes} fontSize="md">
                    <InfoOutlineIcon color="gray.500" cursor="pointer" />
                  </Tooltip>
                </ApplicantData>
                <ApplicantData>
                  <Button colorScheme="blue" size="sm" mr={2}>
                    Contact
                  </Button>
                  <Button colorScheme="green" size="sm" mr={2}>
                    Shortlist
                  </Button>
                  <Button colorScheme="red" size="sm">
                    Reject
                  </Button>
                </ApplicantData>
              </ApplicantRow>
            ))}
          </Tbody>
        </Table>
        <IconButton
          icon={<ChevronDownIcon />}
          aria-label="Slide down"
          onClick={handleSlideDown}
          position="absolute"
          right="1rem"
          bottom="1rem"
        />
      </ApplicantsTableContainer>
    </>
  );
};

export default Analytics;