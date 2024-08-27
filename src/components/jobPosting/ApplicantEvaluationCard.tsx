// src/components/jobPosting/ApplicantEvaluationCard.tsx

import React, { useState, useEffect } from 'react';
import { Box, Text, Progress, VStack, HStack, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiCpu } from 'react-icons/fi';

interface ApplicantEvaluationCardProps {
  applicantName: string;
}

const ApplicantEvaluationCard: React.FC<ApplicantEvaluationCardProps> = ({ applicantName }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing evaluation');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 25) {
      setStatus('Analyzing resume');
    } else if (progress < 50) {
      setStatus('Comparing with job requirements');
    } else if (progress < 75) {
      setStatus('Evaluating skills and experience');
    } else {
      setStatus('Finalizing evaluation');
    }
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        bg="white"
        boxShadow="md"
        borderRadius="lg"
        p={4}
        mb={4}
      >
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <Text fontWeight="bold" fontSize="lg">
              {applicantName}
            </Text>
            <Icon as={FiCpu} color="blue.500" />
          </HStack>
          <Text color="gray.600">{status}</Text>
          <Progress
            value={progress}
            size="sm"
            colorScheme="blue"
            hasStripe
            isAnimated
          />
        </VStack>
      </Box>
    </motion.div>
  );
};

export default ApplicantEvaluationCard;