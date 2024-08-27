import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Flex,
  HStack,
  Button,
  Input,
  useColorModeValue,
  SimpleGrid,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Badge,
  VStack,
} from "@chakra-ui/react";
import { FiPlus, FiUsers, FiBriefcase, FiSearch, FiChevronRight, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { JobPosting } from '../api/types';

interface JobHubProps {
  onSelectJobPosting: (jobPosting: JobPosting) => void;
}

interface DummyJob {
  id: string;
  title: string;
  department: string;
  createdAt: string;
  daysOpen: number | string;
  status: string;
  closedDate?: string;
}

const dummyJobs: DummyJob[] = [
  // Engineering Jobs
  { id: '1', title: 'Frontend Developer', department: 'Engineering', createdAt: '2023-05-01', daysOpen: 30, status: 'Open' },
  { id: '2', title: 'Backend Engineer', department: 'Engineering', createdAt: '2023-04-15', daysOpen: 46, status: 'Open' },
  { id: '3', title: 'DevOps Specialist', department: 'Engineering', createdAt: '2023-03-01', daysOpen: 'Closed - Unfilled', status: 'Closed - Unfilled' },
  { id: '4', title: 'Data Engineer', department: 'Engineering', createdAt: '2023-05-10', daysOpen: 21, status: 'Open' },
  { id: '5', title: 'Software Architect', department: 'Engineering', createdAt: '2023-04-01', daysOpen: 'Closed - 60', status: 'Closed', closedDate: '2023-05-31' },
  // Product Jobs
  { id: '6', title: 'Product Marketer', department: 'Product', createdAt: '2023-05-15', daysOpen: 16, status: 'Waiting for Rubric' },
  { id: '7', title: 'UX/UI Designer', department: 'Product', createdAt: '2023-05-20', daysOpen: 11, status: 'Waiting for Job Description' },
  { id: '8', title: 'Product Manager - Technical', department: 'Product', createdAt: '2023-05-25', daysOpen: 6, status: 'Waiting for Posting' },
  // Support Jobs
  { id: '9', title: 'Customer Support Specialist', department: 'Support', createdAt: '2023-05-05', daysOpen: 26, status: 'Open' },
  { id: '10', title: 'Technical Support Engineer', department: 'Support', createdAt: '2023-05-12', daysOpen: 19, status: 'Interviewing' },
  { id: '11', title: 'Support Team Lead', department: 'Support', createdAt: '2023-04-20', daysOpen: 41, status: 'Final Round' },
];

const JobHub: React.FC<JobHubProps> = ({ onSelectJobPosting }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [currentDepartmentIndex, setCurrentDepartmentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const departments = ['Engineering', 'Product', 'Support'];
  const containerRef = useRef<HTMLDivElement>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverShadow = useColorModeValue('lg', 'dark-lg');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCreateClient = () => {
    // Logic to create a new client
  };

  const handleCreateDepartment = () => {
    // Logic to create a new department
  };

  const renderJobCards = (department: string) => {
    return dummyJobs
      .filter(job => job.department === department)
      .map((job) => (
        <Box 
          key={job.id} 
          bg={bgColor}
          p={6} 
          borderRadius="lg" 
          boxShadow="md"
          cursor="pointer"
          onClick={() => {
            setSelectedJob(job.title);
            onSelectJobPosting(job as any);
          }}
          _hover={{ boxShadow: hoverShadow }}
          opacity={job.status.toLowerCase().includes('closed') ? 0.6 : 1}
        >
          <Heading as="h3" size="md" mb={2}>{job.title}</Heading>
          <Text fontSize="sm" color="gray.500" mb={2}>Department: {job.department}</Text>
          <Text fontSize="sm" mb={2}>Created: {job.createdAt}</Text>
          <Text fontSize="sm" mb={2}>
            Days Open: {typeof job.daysOpen === 'number' ? `${job.daysOpen} days` : job.daysOpen}
          </Text>
          {job.closedDate && (
            <Text fontSize="sm" mb={2}>Closed on: {job.closedDate}</Text>
          )}
          <Text fontSize="sm" mb={2}>
            Status: <Badge colorScheme={job.status.toLowerCase().includes('open') ? 'green' : 'gray'}>
              {job.status}
            </Badge>
          </Text>
        </Box>
      ));
  };

  const handleSlideUp = () => {
    if (currentDepartmentIndex > 0 && !isSliding) {
      setIsSliding(true);
      setCurrentDepartmentIndex(currentDepartmentIndex - 1);
    }
  };

  const handleSlideDown = () => {
    if (currentDepartmentIndex < departments.length - 1 && !isSliding) {
      setIsSliding(true);
      setCurrentDepartmentIndex(currentDepartmentIndex + 1);
    }
  };

  useEffect(() => {
    if (isSliding) {
      const timer = setTimeout(() => {
        setIsSliding(false);
      }, 300); // Match this with the transition duration
      return () => clearTimeout(timer);
    }
  }, [isSliding]);

  return (
    <ErrorBoundary>
      <Container maxWidth="7xl" p={8}>
        <ToastContainer />
        
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Heading as="h1" size="2xl">Job Hub</Heading>
          <HStack spacing={4}>
            <Button leftIcon={<FiUsers />} colorScheme="blue" size="md" onClick={handleCreateClient}>
              Create Client
            </Button>
            <Button leftIcon={<FiBriefcase />} colorScheme="blue" size="md" onClick={handleCreateDepartment}>
              Create Department
            </Button>
            <Button leftIcon={<FiPlus />} colorScheme="blue" size="md">
              Create New Job
            </Button>
          </HStack>
        </Flex>

        <Box bg={useColorModeValue('gray.100', 'gray.700')} p={4} borderRadius="md" mb={6}>
          <Breadcrumb spacing="8px" separator={<FiChevronRight color="gray.500" />}>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">InnovateX</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{departments[currentDepartmentIndex]}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Jobs</BreadcrumbLink>
            </BreadcrumbItem>
            {selectedJob && (
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#">{selectedJob}</BreadcrumbLink>
              </BreadcrumbItem>
            )}
          </Breadcrumb>
        </Box>

        <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md" mb={6}>
          <Heading as="h2" size="lg" mb={4}>Search</Heading>
          <HStack>
            <Input 
              placeholder="Search for jobs..." 
              value={searchQuery} 
              onChange={handleSearchChange} 
            />
            <Button leftIcon={<FiSearch />} colorScheme="teal">
              Search
            </Button>
          </HStack>
        </Box>

        <Flex>
          <VStack mr={4} justifyContent="center" h="600px">
            <Button onClick={handleSlideUp} isDisabled={currentDepartmentIndex === 0 || isSliding}>
              <FiChevronUp />
            </Button>
            <Button onClick={handleSlideDown} isDisabled={currentDepartmentIndex === departments.length - 1 || isSliding}>
              <FiChevronDown />
            </Button>
          </VStack>
          <Box overflow="hidden" h="600px" flex={1}>
            <Box
              ref={containerRef}
              position="relative"
              h="1800px" // 3 * 600px (3 departments)
              transition="transform 0.3s ease-out"
              transform={`translateY(-${currentDepartmentIndex * 600}px)`}
            >
              {departments.map((department, index) => (
                <Box
                  key={department}
                  position="absolute"
                  top={`${index * 600}px`}
                  left="0"
                  right="0"
                  h="600px"
                >
                  <Heading as="h2" size="xl" mb={6}>{department} Jobs</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {renderJobCards(department)}
                  </SimpleGrid>
                </Box>
              ))}
            </Box>
          </Box>
        </Flex>
      </Container>
    </ErrorBoundary>
  );
};

export default JobHub;