// src/components/jobPosting/JobCard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { JobPosting, Applicant, Rubric } from "../../api/types";
import { applicantService, rubricService } from '../../api/services/jobPostingService';
import {
  Box, Flex, Text, Badge, Icon, IconButton, Button, HStack,
  Tooltip, useColorModeValue, CircularProgress, CircularProgressLabel,
  VStack, Collapse
} from "@chakra-ui/react";
import { FiChevronDown, FiChevronUp, FiEdit2, FiTrash2, FiEye, FiClipboard, FiUsers, FiBarChart2, FiCalendar, FiBriefcase, FiMapPin, FiDollarSign } from 'react-icons/fi';
import MiniLoadingAnimation from '../common/MiniLoadingAnimation';
import IJDInfoDisplay from './IJDInfoDisplay';
import ApplicantsList from './ApplicantList';

interface JobCardProps {
  job: JobPosting;
  onViewDetails: (job: JobPosting, initialTab?: string) => void;
  onEditDetails: (job: JobPosting) => void;
  onDelete: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails, onEditDetails, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [applicantsResponse, rubricResponse] = await Promise.all([
          applicantService.getAll(job.id, { page: 1 }),
          rubricService.getByJobPostingId(job.id)
        ]);
        setApplicants(applicantsResponse.data.results);
        setRubric(rubricResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [job.id]);

  const isActive = new Date(job.deadline) > new Date();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'closed': return 'red';
      default: return 'yellow';
    }
  };

  const calculateProgress = () => {
    const totalApplicants = applicants.length;
    const evaluatedApplicants = applicants.filter(a => a.evaluation).length;
    return (evaluatedApplicants / totalApplicants) * 100 || 0;
  };

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
    >
      <Flex p={6} justifyContent="space-between" alignItems="center">
        <VStack align="start" spacing={2}>
          <Flex alignItems="center">
            <Text fontSize="xl" fontWeight="bold" mr={2}>{job.title}</Text>
            <Badge colorScheme={getStatusColor(isActive ? 'active' : 'closed')}>
              {isActive ? 'Active' : 'Closed'}
            </Badge>
          </Flex>
          <HStack spacing={4} color="gray.500" fontSize="sm">
            <Flex align="center"><Icon as={FiBriefcase} mr={1} />{job.company.name}</Flex>
            <Flex align="center"><Icon as={FiMapPin} mr={1} />{job.location || 'Remote'}</Flex>
            <Flex align="center"><Icon as={FiCalendar} mr={1} />Posted: {format(new Date(job.created_at), 'MMM d, yyyy')}</Flex>
            <Flex align="center"><Icon as={FiDollarSign} mr={1} />{job.salary_range || 'Competitive'}</Flex>
          </HStack>
        </VStack>
        <HStack>
          <CircularProgress value={calculateProgress()} color="green.400" size="50px">
            <CircularProgressLabel>{applicants.length}</CircularProgressLabel>
          </CircularProgress>
          <IconButton
            aria-label="Toggle expand"
            icon={isExpanded ? <FiChevronUp /> : <FiChevronDown />}
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
          />
        </HStack>
      </Flex>

      <Collapse in={isExpanded} animateOpacity>
        <Box p={6} borderTop="1px" borderColor={borderColor}>
          {isLoading ? (
            <MiniLoadingAnimation />
          ) : (
            <VStack spacing={6} align="stretch">
              <Box>
                <Text fontWeight="bold" mb={2}>Job Details</Text>
                <IJDInfoDisplay
                  ijdInfo={job.ijd_info}
                  jobPostingId={job.id}
                  isEditable={false}
                  isPublic={false}
                />
              </Box>
              <Box>
                <Text fontWeight="bold" mb={2}>Recent Applicants</Text>
                <ApplicantsList
                  jobPosting={job}
                  applicants={applicants.slice(0, 5)}
                  rubric={rubric!}
                  onViewApplicant={() => {}}
                  onRefresh={() => {}}
                />
              </Box>
            </VStack>
          )}
        </Box>
      </Collapse>

      <Flex justifyContent="space-between" alignItems="center" p={4} borderTop="1px" borderColor={borderColor}>
        <HStack spacing={2}>
          <Tooltip label="View Details">
            <IconButton aria-label="View Details" icon={<FiEye />} onClick={() => onViewDetails(job)} colorScheme="blue" variant="ghost" />
          </Tooltip>
          <Tooltip label="View Rubric">
            <IconButton aria-label="View Rubric" icon={<FiClipboard />} onClick={() => onViewDetails(job, 'rubric')} colorScheme="green" variant="ghost" />
          </Tooltip>
          <Tooltip label="View Applicants">
            <IconButton aria-label="View Applicants" icon={<FiUsers />} onClick={() => onViewDetails(job, 'applicants')} colorScheme="orange" variant="ghost" />
          </Tooltip>
          <Tooltip label="Edit Job Posting">
            <IconButton aria-label="Edit Job Posting" icon={<FiEdit2 />} onClick={() => onEditDetails(job)} colorScheme="purple" variant="ghost" />
          </Tooltip>
          <Tooltip label="Delete Job Posting">
            <IconButton aria-label="Delete Job Posting" icon={<FiTrash2 />} onClick={onDelete} colorScheme="red" variant="ghost" />
          </Tooltip>
        </HStack>
        <Button leftIcon={<FiBarChart2 />} colorScheme="teal" variant="outline" size="sm" onClick={() => onViewDetails(job, 'analytics')}>
          View Analytics
        </Button>
      </Flex>
    </Box>
  );
};

export default JobCard;