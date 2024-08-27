import React, { useState, useEffect } from 'react';
import {
  Box, VStack, HStack, Text, Select, Table, Thead, Tbody, Tr, Th, Td,
  useColorModeValue, Skeleton, Button, Tooltip
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiRefreshCcw } from 'react-icons/fi';
import { Rubric } from '../../api/types';
import { rubricService } from '../../api/services/jobPostingService';
import jobPosting from "../../pages/JobPosting";

interface RubricComparisonViewProps {
  currentRubric: Rubric | null;
}

interface RubricComparisonViewProps {
  currentRubric: Rubric | null;
}

const MotionBox = motion(Box);

const RubricComparisonView: React.FC<RubricComparisonViewProps> = ({ currentRubric }) => {
  const [comparisonRubric, setComparisonRubric] = useState<Rubric | null>(null);
  const [rubricOptions, setRubricOptions] = useState<Rubric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const highlightColor = useColorModeValue('yellow.100', 'yellow.700');

  useEffect(() => {
    const fetchRubricOptions = async () => {
      if (!currentRubric) return;
      setIsLoading(true);
      try {
        const response = await rubricService.getAllByJobPosting(currentRubric.job_posting, { page: 1 });
        setRubricOptions(response.data.results.filter((r: Rubric) => r.id !== currentRubric.id));
      } catch (error) {
        console.error('Error fetching rubric options:', error);
        setRubricOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRubricOptions();
  }, [currentRubric]);


  const handleComparisonChange = (rubricId: string) => {
    const selected = rubricOptions.find(r => r.id.toString() === rubricId);
    setComparisonRubric(selected || null);
  };

  const renderComparisonRow = (category: string, currentValue: any, comparisonValue: any) => {
    const isDifferent = JSON.stringify(currentValue) !== JSON.stringify(comparisonValue);

    return (
      <Tr key={category} bg={isDifferent ? highlightColor : 'transparent'}>
        <Td fontWeight="bold">{category}</Td>
        <Td>{JSON.stringify(currentValue)}</Td>
        <Td>{JSON.stringify(comparisonValue)}</Td>
      </Tr>
    );
  };

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="2xl" fontWeight="bold">Rubric Comparison</Text>
          <Select
            placeholder="Select rubric to compare"
            onChange={(e) => handleComparisonChange(e.target.value)}
            width="300px"
            isDisabled={isLoading}
          >
            {rubricOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.content.title} (ID: {option.id})
              </option>
            ))}
          </Select>
        </HStack>

        {isLoading ? (
          <Skeleton height="400px" />
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Category</Th>
                  <Th>Current Rubric</Th>
                  <Th>Comparison Rubric</Th>
                </Tr>
              </Thead>
              <Tbody>
                {renderComparisonRow('Title', currentRubric?.content.title, comparisonRubric?.content.title)}
                {renderComparisonRow('Description', currentRubric?.content.description, comparisonRubric?.content.description)}
                {currentRubric?.content.categories.map((category, index) => (
                  <React.Fragment key={index}>
                    {renderComparisonRow(
                      `Category ${index + 1}`,
                      category,
                      comparisonRubric?.content.categories[index]
                    )}
                  </React.Fragment>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}

        <HStack justify="flex-end">
          <Tooltip label="Reset comparison">
            <Button
              leftIcon={<FiRefreshCcw />}
              onClick={() => setComparisonRubric(null)}
              isDisabled={!comparisonRubric}
            >
              Reset Comparison
            </Button>
          </Tooltip>
        </HStack>
      </VStack>
    </MotionBox>
  );
};

export default RubricComparisonView;