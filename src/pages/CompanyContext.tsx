// src/pages/CompanyContext.tsx
import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Textarea,
  Input,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';

interface CompanyContextItem {
  id: number;
  category: string;
  content: string;
}

const placeholderData: CompanyContextItem[] = [
  {
    id: 1,
    category: "Company History",
    content: "Founded in 2010, our company has grown from a small startup to a leader in the tech industry. We've consistently innovated in the field of AI and machine learning."
  },
  {
    id: 2,
    category: "Company Culture",
    content: "We prioritize collaboration, innovation, and work-life balance. Our diverse team comes from various backgrounds, bringing unique perspectives to our projects."
  },
  {
    id: 3,
    category: "Products and Services",
    content: "Our main products include AI-powered analytics tools, machine learning platforms, and custom software solutions for enterprises."
  }
];

const CompanyContext: React.FC = () => {
  const [companyContext, setCompanyContext] = useState<CompanyContextItem[]>(placeholderData);

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  const handleAddCategory = () => {
    const newId = Math.max(...companyContext.map(item => item.id), 0) + 1;
    setCompanyContext([
      ...companyContext,
      { id: newId, category: 'New Category', content: '' }
    ]);
  };

  const handleUpdateCategory = (id: number, field: 'category' | 'content', value: string) => {
    setCompanyContext(companyContext.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleDeleteCategory = (id: number) => {
    setCompanyContext(companyContext.filter(item => item.id !== id));
  };

  const handleSave = () => {
    console.log('Saving company context:', companyContext);
    // Here you would typically make an API call to save the data
    // For now, we'll just log it to the console
  };

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="xl">
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" color={textColor}>
          Company Context
        </Heading>
        <Text color={textColor}>
          Provide custom information about your company for the AI to reference when answering questions.
        </Text>
        <Accordion allowMultiple>
          {companyContext.map((item) => (
            <AccordionItem key={item.id}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    {item.category}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <VStack spacing={4}>
                  <Input
                    value={item.category}
                    onChange={(e) => handleUpdateCategory(item.id, 'category', e.target.value)}
                    placeholder="Category name"
                  />
                  <Textarea
                    value={item.content}
                    onChange={(e) => handleUpdateCategory(item.id, 'content', e.target.value)}
                    placeholder="Enter context information here"
                    rows={5}
                  />
                  <Flex justifyContent="flex-end" width="100%">
                    <IconButton
                      aria-label="Delete category"
                      icon={<FiTrash2 />}
                      onClick={() => handleDeleteCategory(item.id)}
                      colorScheme="red"
                    />
                  </Flex>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
        <Button leftIcon={<FiPlus />} onClick={handleAddCategory}>
          Add Category
        </Button>
        <Button leftIcon={<FiSave />} onClick={handleSave} colorScheme="blue">
          Save Changes
        </Button>
      </VStack>
    </Box>
  );
};

export default CompanyContext;