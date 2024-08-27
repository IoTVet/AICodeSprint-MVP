import React, {useState, useMemo, useCallback, useEffect} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  Applicant,
  JobPosting,
  CategoryEvaluation,
  Rubric,
  Category,
  ScoringLevel,
  EvaluationContent
} from "../../api/types";
import {
  Box, VStack, HStack, Text, Input, Select, Button, Flex, Icon, Tooltip, Badge,
  useColorModeValue, useToast, CircularProgress, CircularProgressLabel, IconButton,
  Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Heading,
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  useDisclosure, Table, Thead, Tbody, Tr, Th, Td, Progress, InputGroup, InputLeftElement, Link,
} from "@chakra-ui/react";
import {FiEye, FiUpload, FiTrash, FiFilter, FiSearch, FiBarChart2, FiPlus, FiDownload} from 'react-icons/fi';
import ApplicantUploadModal from "./ApplicantUploadModal";
import { applicantService, jobPostingService } from "../../api/services/jobPostingService";
import ApplicantEvaluationCard from "./ApplicantEvaluationCard";
import ConfirmationModal from "./ConfirmationModal";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import StatisticsModal from "./StatisticsModal";
import {over} from "lodash";

interface ApplicantsListProps {
  jobPosting: JobPosting;
  applicants: Applicant[];
  rubric: Rubric;
  onViewApplicant: (applicant: Applicant) => void;
  onRefresh: () => void;
}

const ApplicantsList: React.FC<ApplicantsListProps> = ({ jobPosting, applicants, rubric, onViewApplicant, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'appliedAt' | 'status' | 'score'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [evaluatingApplicants, setEvaluatingApplicants] = useState<string[]>([]);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [applicantToDelete, setApplicantToDelete] = useState<Applicant | null>(null);
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const cardBgColor = useColorModeValue('gray.50', 'gray.700');
  console.log('Received Rubric:', rubric);
  useEffect(() => {
    console.log('Rubric in useEffect:', rubric);
  }, [rubric]);
  const { categoryMaxScores, overallMaxScore } = useMemo(() => {
  const categoryMaxScores: { [key: string]: number } = {};
  let overallMaxScore = 100; // The maximum possible score is always 100%

  rubric?.content.categories.forEach((category: Category) => {
    const maxScore = Math.max(...category.scoring_levels.map((level: ScoringLevel) => level.score));
    categoryMaxScores[category.name] = maxScore;
  });

  console.log('Category Max Scores:', categoryMaxScores);
  console.log('Overall Max Score:', overallMaxScore);
  return { categoryMaxScores, overallMaxScore };
}, [rubric]);

  const calculateWeightedScore = useCallback((evaluationContent: EvaluationContent): number => {
  console.log('Evaluation Content:', evaluationContent);
  console.log('Rubric:', rubric);

  if (!rubric || !rubric.content || !rubric.content.categories) {
    console.error('Rubric is not properly defined');
    return 0;
  }

  const totalScore = evaluationContent?.evaluations?.reduce((total, evalItem) => {
    console.log('Eval Item:', evalItem);

    const category = rubric.content.categories.find(c => c.name === evalItem.category);
    console.log('Matching Category:', category);

    if (category) {
      const maxScore = Math.max(...category.scoring_levels.map(level => level.score));
      const normalizedScore = evalItem.score / maxScore; // Normalize the score to a 0-1 range
      const weightedScore = normalizedScore * category.weight;
      console.log(`Category: ${category.name}, Score: ${evalItem.score}, Max Score: ${maxScore}, Weight: ${category.weight}, Weighted Score: ${weightedScore}`);
      return total + weightedScore;
    } else {
      console.warn(`No matching category found for: ${evalItem.category}`);
      return total;
    }
  }, 0);

  // The total score is already a percentage (0-1 range) because we normalized each category score
  const percentageScore = totalScore * 100;
  console.log('Total Percentage Score:', percentageScore);
  return percentageScore;
}, [rubric]);



  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "green.400";
    if (percentage >= 60) return "blue.400";
    if (percentage >= 40) return "yellow.400";
    return "red.400";
  };

  const filteredAndSortedApplicants = useMemo(() => {
    return applicants
      .filter(applicant =>
        `${applicant.first_name} ${applicant.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const scoreA = calculateWeightedScore(a.evaluation?.content);
        const scoreB = calculateWeightedScore(b.evaluation?.content);

        switch (sortBy) {
          case 'name':
            return sortOrder === 'asc'
              ? `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
              : `${b.first_name} ${b.last_name}`.localeCompare(`${a.first_name} ${a.last_name}`);
          case 'appliedAt':
            return sortOrder === 'asc'
              ? new Date(a.applied_at).getTime() - new Date(b.applied_at).getTime()
              : new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime();
          case 'status':
            return sortOrder === 'asc'
              ? a.status.localeCompare(b.status)
              : b.status.localeCompare(a.status);
          case 'score':
            return sortOrder === 'asc' ? scoreA - scoreB : scoreB - scoreA;
          default:
            return 0;
        }
      });
  }, [applicants, searchTerm, sortBy, sortOrder, rubric]);

  const handleSort = (newSortBy: 'name' | 'appliedAt' | 'status' | 'score') => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const handleDeleteClick = (applicant: Applicant) => {
    setApplicantToDelete(applicant);
    setIsDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (applicantToDelete) {
      try {
        await applicantService.delete(applicantToDelete.id);
        toast({
          title: "Applicant deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onRefresh();
      } catch (error) {
        console.error('Error deleting applicant:', error);
        toast({
          title: "Error deleting applicant",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
    setIsDeleteConfirmationOpen(false);
    setApplicantToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmationOpen(false);
    setApplicantToDelete(null);
  };

  const handleUploadResume = async (formData: FormData) => {
    try {
      setEvaluatingApplicants(prev => [...prev, 'New Applicant']);
      await jobPostingService.evaluateCandidate(jobPosting.id, formData);
      toast({ title: 'Resume uploaded and evaluation started', status: 'success' });
      onRefresh();
    } catch (error) {
      toast({ title: 'Error uploading resume', status: 'error' });
    } finally {
      setEvaluatingApplicants(prev => prev.filter(name => name !== 'New Applicant'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hired': return 'green';
      case 'rejected': return 'red';
      case 'interview': return 'blue';
      case 'offer': return 'purple';
      default: return 'yellow';
    }
  };

  const handleViewApplicant = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    onDrawerOpen();
  };

  const scoreDistribution = useMemo(() => {
  console.log('Calculating score distribution');
  console.log('Filtered and Sorted Applicants:', filteredAndSortedApplicants);
  console.log('Overall Max Score:', overallMaxScore);

  const distribution = Array(10).fill(0);
  filteredAndSortedApplicants.forEach(applicant => {
    console.log('Processing Applicant:', applicant.first_name, applicant.last_name);
    console.log('Applicant Evaluation:', applicant.evaluation);

    if (applicant.evaluation?.content) {
      const weightedScore = calculateWeightedScore(applicant.evaluation.content);
      console.log('Calculated Weighted Score:', weightedScore);

      const score = Math.floor((weightedScore / overallMaxScore) * 10);
      console.log('Normalized Score (0-9):', score);

      distribution[score >= 10 ? 9 : score]++;
    } else {
      console.log('No evaluation content for this applicant');
    }
  });

  console.log('Final Score Distribution:', distribution);
  return distribution;
}, [filteredAndSortedApplicants, overallMaxScore, calculateWeightedScore]);

  const calculatePercentile = (index: number, total: number) => {
  return Math.round(((total - index) / total) * 100);
};

  const calculateCategoryPercentile = (applicant: Applicant, category: string, allApplicants: Applicant[]) => {
  const categoryScores = allApplicants.map(a =>
    a.evaluation?.content.evaluations.find(e => e.category === category)?.score || 0
  );
  const applicantScore = applicant.evaluation?.content?.evaluations?.find(e => e.category === category)?.score || 0;
  const lowerScores = categoryScores.filter(score => score < applicantScore).length;

  return Math.round((lowerScores / allApplicants.length) * 100);
};

  const chartData = {
    labels: ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100'],
    datasets: [
      {
        label: 'Number of Applicants',
        data: scoreDistribution,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };



  return (
    <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="xl">
      <VStack spacing={6} align="stretch">

          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <Heading size="lg">Applicants for {jobPosting.title}</Heading>
            <HStack spacing={4}>
              {applicants.length > 25 &&
                <Button
                  leftIcon={<FiBarChart2/>}
                  colorScheme="teal"
                  onClick={() => setIsStatsModalOpen(true)}
              >
                View Applicant Statistics
              </Button>
              }
              <Button
                leftIcon={<FiUpload />}
                colorScheme="blue"
                onClick={() => setIsUploadModalOpen(true)}
              >
                Upload Applicant
              </Button>
            </HStack>
          </Flex>

        <Flex justifyContent="space-between" alignItems="center">
          <InputGroup width="40%">
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <HStack>
            <Select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy as 'name' | 'appliedAt' | 'status' | 'score');
                setSortOrder(newSortOrder as 'asc' | 'desc');
              }}
              width="200px"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="appliedAt-desc">Latest Applied</option>
              <option value="appliedAt-asc">Earliest Applied</option>
              <option value="status-asc">Status (A-Z)</option>
              <option value="status-desc">Status (Z-A)</option>
              <option value="score-desc">Highest Score</option>
              <option value="score-asc">Lowest Score</option>
            </Select>
            <IconButton
              aria-label="Filter"
              icon={<FiFilter />}
              onClick={() => {/* Implement advanced filtering */}}
            />
          </HStack>
        </Flex>

        {evaluatingApplicants.map(name => (
          <ApplicantEvaluationCard key={name} applicantName={name} />
        ))}

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Status</Th>
              <Th>Applied</Th>
              <Th>Score</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            <AnimatePresence>
              {filteredAndSortedApplicants.map((applicant, index) => (
                <motion.tr
                  key={applicant.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Td>{`${applicant.first_name} ${applicant.last_name}`}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(applicant.status)}>
                      {applicant.status}
                    </Badge>
                  </Td>
                  <Td>{format(new Date(applicant.applied_at), 'MMM d, yyyy')}</Td>
                  <Td>
                  <Flex alignItems="center">
                    <CircularProgress
                      value={calculateWeightedScore(applicant.evaluation?.content)}
                      color={getScoreColor(calculateWeightedScore(applicant.evaluation?.content), 100)}
                      size="40px"
                      mr={2}
                    >
                      <CircularProgressLabel>
                        {calculateWeightedScore(applicant.evaluation?.content).toFixed(0)}%
                      </CircularProgressLabel>
                    </CircularProgress>
                    <VStack align="start" spacing={0}>
                      <Progress
                        value={calculateWeightedScore(applicant.evaluation?.content)}
                        size="sm"
                        width="100px"
                        colorScheme={getScoreColor(calculateWeightedScore(applicant.evaluation?.content), 100).split('.')[0]}
                      />
                      { applicants.length > 25 &&
                      <Text fontSize="xs" fontWeight="bold">
                        {`${calculatePercentile(index, filteredAndSortedApplicants.length)}th percentile`}
                      </Text>
                      }
                    </VStack>
                  </Flex>
                </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Tooltip label="View Profile">
                        <IconButton
                          aria-label="View Profile"
                          icon={<FiEye />}
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleViewApplicant(applicant)}
                        />
                      </Tooltip>
                      <Tooltip label="Delete Applicant">
                        <IconButton
                          aria-label="Delete Applicant"
                          icon={<FiTrash />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDeleteClick(applicant)}
                        />
                      </Tooltip>
                    </HStack>
                  </Td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </Tbody>
        </Table>
      </VStack>

      <ApplicantUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        jobPostingId={jobPosting.id}
        onUploadSuccess={handleUploadResume}
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmationOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        title="Delete Applicant"
        message="Are you sure you want to delete this applicant? This action cannot be undone."
      />

      <Drawer
        isOpen={isDrawerOpen}
        placement="right"
        onClose={onDrawerClose}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Applicant Profile</DrawerHeader>
          <DrawerBody>
            {selectedApplicant && (
              <VStack spacing={6} align="stretch">
                <Flex justifyContent="space-between" alignItems="center">
                  <VStack align="start" spacing={1}>
                    <Heading size="lg">{`${selectedApplicant.first_name} ${selectedApplicant.last_name}`}</Heading>
                    <Text color="gray.500">{selectedApplicant.email}</Text>
                  </VStack>
                  <Badge colorScheme={getStatusColor(selectedApplicant.status)} fontSize="md">
                    {selectedApplicant.status}
                  </Badge>
                </Flex>

                <Box>
                  <Heading size="md" mb={2}>Contact Information</Heading>
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text fontWeight="bold">Email</Text>
                      <Text>{selectedApplicant.email}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Phone</Text>
                      <Text>{selectedApplicant.phone}</Text>
                    </Box>
                    {selectedApplicant.linkedin_url && (
                      <Box>
                        <Text fontWeight="bold">LinkedIn</Text>
                        <Link href={selectedApplicant.linkedin_url} isExternal color="blue.500">
                          Profile
                        </Link>
                      </Box>
                    )}
                    {selectedApplicant.github_url && (
                      <Box>
                        <Text fontWeight="bold">GitHub</Text>
                        <Link href={selectedApplicant.github_url} isExternal color="blue.500">
                          Profile
                        </Link>
                      </Box>
                    )}
                  </SimpleGrid>
                </Box>

                <Box>
                  <Heading size="md" mb={2}>Evaluation</Heading>
                  {selectedApplicant.evaluation?.content?.evaluations?.map((evalItem: CategoryEvaluation, index: number) => (
                    <Box key={index} mb={4}>
                      <Flex justifyContent="space-between" alignItems="center" mb={1}>
                        <Text fontWeight="bold">{evalItem.category}</Text>
                        <HStack spacing={2}>
                          <Text>{evalItem.score.toFixed(1)} / {categoryMaxScores[evalItem.category]}</Text>
                          { applicants.length > 25  &&
                          <Badge colorScheme="purple">
                            {`${calculateCategoryPercentile(selectedApplicant, evalItem.category, filteredAndSortedApplicants)}th percentile`}
                          </Badge>
                          }
                        </HStack>
                      </Flex>
                      <Progress
                        value={(evalItem.score / categoryMaxScores[evalItem.category]) * 100}
                        size="sm"
                        colorScheme={getScoreColor(evalItem.score, categoryMaxScores[evalItem.category]).split('.')[0]}
                      />
                      <Text fontSize="sm" mt={1}>{evalItem.justification}</Text>
                    </Box>
                  ))}
                </Box>

                <Box>
                  <Heading size="md" mb={2}>Overall Assessment</Heading>
                  <Text>{selectedApplicant.evaluation?.content.overall_assessment}</Text>
                </Box>

                <Box>
                  <Heading size="md" mb={2}>Resume</Heading>
                  <Button leftIcon={<FiDownload />} onClick={() => {/* Implement resume download */}}>
                    Download Resume
                  </Button>
                </Box>

                <Box>
                  <Heading size="md" mb={2}>Notes</Heading>
                  {selectedApplicant.notes && selectedApplicant.notes.length > 0 ? (
                    selectedApplicant.notes.map((note, index) => (
                      <Box key={index} p={3} bg={cardBgColor} borderRadius="md" mb={2}>
                        <Text fontWeight="bold">{note.author}</Text>
                        <Text fontSize="sm" color="gray.500">{format(new Date(note.created_at), 'MMM d, yyyy HH:mm')}</Text>
                        <Text mt={2}>{note.content}</Text>
                      </Box>
                    ))
                  ) : (
                    <Text color="gray.500">No notes available</Text>
                  )}
                  <Button leftIcon={<FiPlus />} mt={2} onClick={() => {/* Implement add note functionality */}}>
                    Add Note
                  </Button>
                </Box>
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <StatisticsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        applicants={filteredAndSortedApplicants}
        overallMaxScore={overallMaxScore}
        categoryMaxScores={categoryMaxScores}
      />
    </Box>
  );
};

export default ApplicantsList;