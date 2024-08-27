import React, { useEffect, useState } from 'react';
import {
  Box, VStack, HStack, Text, Badge, useColorModeValue,
  Button, Skeleton, Tooltip, IconButton
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiUser, FiInfo, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { Rubric } from '../../api/types';
import { rubricService } from '../../api/services/jobPostingService';

interface RubricHistoryTimelineProps {
  jobPostingId: number;
}

interface RubricVersion {
  id: number;
  version: number;
  createdAt: string;
  createdBy: string;
  changes: string[];
}

const MotionBox = motion(Box);

const RubricHistoryTimeline: React.FC<RubricHistoryTimelineProps> = ({ jobPostingId }) => {
  const [history, setHistory] = useState<RubricVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverColor = useColorModeValue('gray.100', 'gray.600');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!jobPostingId) {
        console.log('No jobPostingId provided');
        setHistory([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await rubricService.getRubricHistory(jobPostingId);
        console.log('Fetched history:', response);
        setHistory(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error in component when fetching rubric history:', error);
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [jobPostingId]);

  const paginatedHistory = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(history.length / itemsPerPage);

  if (isLoading) {
    return (
      <VStack spacing={4} align="stretch">
        {[...Array(itemsPerPage)].map((_, index) => (
          <Skeleton key={index} height="100px" />
        ))}
      </VStack>
    );
  }

  if (history.length === 0) {
    return <Text>No history available</Text>;
  }

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>Rubric Version History</Text>
      <VStack spacing={4} align="stretch">
        <AnimatePresence>
          {paginatedHistory.map((version, index) => (
            <MotionBox
              key={version.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              bg={bgColor}
              borderWidth={1}
              borderColor={borderColor}
              borderRadius="md"
              p={4}
              _hover={{ bg: hoverColor }}
            >
              <HStack justify="space-between" mb={2}>
                <Badge colorScheme="blue">Version {version.version}</Badge>
                <HStack>
                  <FiClock />
                  <Text fontSize="sm">{new Date(version.createdAt).toLocaleString()}</Text>
                </HStack>
              </HStack>
              <HStack mb={2}>
                <FiUser />
                <Text fontSize="sm">{version.createdBy}</Text>
              </HStack>
              {/*<VStack align="start" spacing={1}>*/}
              {/*  {version.changes.map((change, changeIndex) => (*/}
              {/*    <HStack key={changeIndex}>*/}
              {/*      <FiInfo size={14} />*/}
              {/*      <Text fontSize="sm">{change}</Text>*/}
              {/*    </HStack>*/}
              {/*  ))}*/}
              {/*</VStack>*/}
            </MotionBox>
          ))}
        </AnimatePresence>
      </VStack>
      {history.length > itemsPerPage && (
        <HStack justify="center" mt={6}>
          <Tooltip label="Previous page">
            <IconButton
              icon={<FiArrowLeft />}
              aria-label="Previous page"
              isDisabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            />
          </Tooltip>
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <Tooltip label="Next page">
            <IconButton
              icon={<FiArrowRight />}
              aria-label="Next page"
              isDisabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            />
          </Tooltip>
        </HStack>
      )}
    </Box>
  );
};

export default RubricHistoryTimeline;