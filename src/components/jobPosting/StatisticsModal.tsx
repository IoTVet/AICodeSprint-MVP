import React, { useMemo } from "react";
import { Applicant, CategoryEvaluation } from "../../api/types";
import {
    Box, Flex, Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay, Progress, SimpleGrid, Stat, StatLabel, StatNumber,
    VStack, Text
} from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicants: Applicant[];
  overallMaxScore: number;
  categoryMaxScores: { [key: string]: number };
}

const StatisticsModal: React.FC<StatisticsModalProps> = ({
  isOpen,
  onClose,
  applicants,
  overallMaxScore,
  categoryMaxScores
}) => {
  const calculateWeightedScore = (evaluations: CategoryEvaluation[]): number => {
    return evaluations.reduce((total, evalItem) => {
      const category = Object.keys(categoryMaxScores).find(cat => cat === evalItem.category);
      if (category) {
        return total + (evalItem.score / categoryMaxScores[category]);
      }
      return total;
    }, 0) / Object.keys(categoryMaxScores).length;
  };

  const scoreDistribution = useMemo(() => {
    const distribution = Array(10).fill(0);
    applicants.forEach(applicant => {
      const score = Math.floor(calculateWeightedScore(applicant.evaluation?.content.evaluations || []) * 10);
      distribution[score >= 10 ? 9 : score]++;
    });
    return distribution;
  }, [applicants]);

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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Applicant Score Distribution',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Applicants',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Score Range (%)',
        },
      },
    },
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxWidth="90vw">
        <ModalHeader>Applicant Statistics</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="md" mb={2}>Overall Statistics</Heading>
              <SimpleGrid columns={2} spacing={4}>
                <Stat>
                  <StatLabel>Total Applicants</StatLabel>
                  <StatNumber>{applicants.length}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Average Score</StatLabel>
                  <StatNumber>
                    {(applicants.reduce((sum, applicant) =>
                      sum + calculateWeightedScore(applicant.evaluation?.content.evaluations || []) * 100, 0
                    ) / applicants.length).toFixed(2)}%
                  </StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Highest Score</StatLabel>
                  <StatNumber>
                    {Math.max(...applicants.map(applicant =>
                      calculateWeightedScore(applicant.evaluation?.content.evaluations || []) * 100
                    )).toFixed(2)}%
                  </StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Lowest Score</StatLabel>
                  <StatNumber>
                    {Math.min(...applicants.map(applicant =>
                      calculateWeightedScore(applicant.evaluation?.content.evaluations || []) * 100
                    )).toFixed(2)}%
                  </StatNumber>
                </Stat>
              </SimpleGrid>
            </Box>
            <Box height="300px">
              <Bar data={chartData} options={chartOptions} />
            </Box>
            <Box>
              <Heading size="md" mb={2}>Category Statistics</Heading>
              {Object.entries(categoryMaxScores).map(([category, maxScore]) => (
                <Box key={category} mb={4}>
                  <Text fontWeight="bold">{category}</Text>
                  <Flex alignItems="center">
                    <Progress
                      value={(applicants.reduce((sum, applicant) =>
                        sum + (applicant.evaluation?.content.evaluations.find(e => e.category === category)?.score || 0), 0
                      ) / (applicants.length * maxScore)) * 100}
                      size="sm"
                      width="100%"
                      colorScheme="blue"
                      mr={2}
                    />
                    <Text fontWeight="bold">
                      {((applicants.reduce((sum, applicant) =>
                        sum + (applicant.evaluation?.content.evaluations.find(e => e.category === category)?.score || 0), 0
                      ) / (applicants.length * maxScore)) * 100).toFixed(2)}%
                    </Text>
                  </Flex>
                </Box>
              ))}
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default StatisticsModal;