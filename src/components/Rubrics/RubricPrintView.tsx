import React, { useRef } from 'react';
import {
  Box, VStack, HStack, Text, Table, Thead, Tbody, Tr, Th, Td,
  Button, useColorModeValue, Tooltip
} from '@chakra-ui/react';
import { FiPrinter, FiDownload } from 'react-icons/fi';
import { Rubric } from '../../api/types';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';

interface RubricPrintViewProps {
  rubric: Rubric | null;
}

const RubricPrintView: React.FC<RubricPrintViewProps> = ({ rubric }) => {
  const componentRef = useRef(null);
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleExportToExcel = () => {
    if (!rubric) return;

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);

    // Add title and description
    XLSX.utils.sheet_add_aoa(worksheet, [
      ['Rubric: ' + rubric.content.title],
      ['Description: ' + rubric.content.description],
      [],
    ]);

    // Add categories and scoring levels
    rubric.content.categories.forEach((category) => {
      XLSX.utils.sheet_add_aoa(worksheet, [
        ['Category: ' + category.name, 'Weight: ' + category.weight + '%'],
        ['Level', 'Score', 'Description'],
        ...category.scoring_levels.map((level) => [
          level.level,
          level.score,
          level.description,
        ]),
        [],
      ], { origin: -1 });
    });

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rubric');
    XLSX.writeFile(workbook, 'rubric_export.xlsx');
  };

  if (!rubric) return null;

  return (
    <Box>
      <HStack justify="flex-end" mb={4} spacing={4}>
        <Tooltip label="Print Rubric">
          <Button leftIcon={<FiPrinter />} onClick={handlePrint}>
            Print
          </Button>
        </Tooltip>
        <Tooltip label="Export to Excel">
          <Button leftIcon={<FiDownload />} onClick={handleExportToExcel}>
            Export to Excel
          </Button>
        </Tooltip>
      </HStack>

      <Box ref={componentRef} bg={bgColor} p={8} borderRadius="md" boxShadow="md">
        <VStack align="stretch" spacing={6}>
          <Text fontSize="3xl" fontWeight="bold" color={textColor}>
            {rubric.content.title}
          </Text>
          <Text fontSize="md" color={textColor}>
            {rubric.content.description}
          </Text>

          {rubric.content.categories.map((category, index) => (
            <Box key={index}>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="xl" fontWeight="semibold" color={textColor}>
                  {category.name}
                </Text>
                <Text fontSize="md" fontWeight="medium" color={textColor}>
                  Weight: {category.weight}%
                </Text>
              </HStack>

              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Level</Th>
                    <Th>Score</Th>
                    <Th>Description</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {category.scoring_levels.map((level, levelIndex) => (
                    <Tr key={levelIndex}>
                      <Td>{level.level}</Td>
                      <Td>{level.score}</Td>
                      <Td>{level.description}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default RubricPrintView;