import React, { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Divider,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { FiEdit, FiPlus, FiMinus } from "react-icons/fi";
import { Rubric, Category, ScoringLevel } from "../../api/types";

interface RubricDetailViewProps {
  rubric: Rubric | null;
}

const RubricDetailView: React.FC<RubricDetailViewProps> = ({
  rubric,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedRubric, setEditedRubric] = useState<Rubric | null>(rubric);
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const handleSaveRubric = () => {
    console.log("Saving edited rubric:", editedRubric);
    closeEditModal();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedRubric(prev => prev ? {
      ...prev,
      content: {
        ...prev.content,
        [name]: value
      }
    } : null);
  };

  const handleCategoryChange = (index: number, field: keyof Category, value: any) => {
    setEditedRubric(prev => {
      if (!prev) return null;
      const newCategories = [...prev.content.categories];
      newCategories[index] = { ...newCategories[index], [field]: value };
      return { ...prev, content: { ...prev.content, categories: newCategories } };
    });
  };

  const handleScoringLevelChange = (categoryIndex: number, levelIndex: number, field: keyof ScoringLevel, value: any) => {
    setEditedRubric(prev => {
      if (!prev) return null;
      const newCategories = [...prev.content.categories];
      const newLevels = [...newCategories[categoryIndex].scoring_levels];
      newLevels[levelIndex] = { ...newLevels[levelIndex], [field]: value };
      newCategories[categoryIndex] = { ...newCategories[categoryIndex], scoring_levels: newLevels };
      return { ...prev, content: { ...prev.content, categories: newCategories } };
    });
  };

  const addCategory = () => {
    setEditedRubric(prev => {
      if (!prev) return null;
      const newCategories = [...prev.content.categories, {
        name: "New Category",
        weight: 0,
        scoring_levels: [{ level: 1, score: 0, description: "Description" }]
      }];
      return { ...prev, content: { ...prev.content, categories: newCategories } };
    });
  };

  const removeCategory = (index: number) => {
    setEditedRubric(prev => {
      if (!prev) return null;
      const newCategories = prev.content.categories.filter((_, i) => i !== index);
      return { ...prev, content: { ...prev.content, categories: newCategories } };
    });
  };

  const addScoringLevel = (categoryIndex: number) => {
    setEditedRubric(prev => {
      if (!prev) return null;
      const newCategories = [...prev.content.categories];
      const newLevels = [...newCategories[categoryIndex].scoring_levels, {
        level: newCategories[categoryIndex].scoring_levels.length + 1,
        score: 0,
        description: "New Level Description"
      }];
      newCategories[categoryIndex] = { ...newCategories[categoryIndex], scoring_levels: newLevels };
      return { ...prev, content: { ...prev.content, categories: newCategories } };
    });
  };

  const removeScoringLevel = (categoryIndex: number, levelIndex: number) => {
    setEditedRubric(prev => {
      if (!prev) return null;
      const newCategories = [...prev.content.categories];
      const newLevels = newCategories[categoryIndex].scoring_levels.filter((_, i) => i !== levelIndex);
      newCategories[categoryIndex] = { ...newCategories[categoryIndex], scoring_levels: newLevels };
      return { ...prev, content: { ...prev.content, categories: newCategories } };
    });
  };

  if (!rubric) {
    return (
      <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md">
        <Text color={textColor}>No rubric available for this job posting.</Text>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md">
      <VStack align="stretch" spacing={6}>
        <Heading as="h2" size="xl" color={textColor}>
          {rubric.content.title || 'Grading Rubric'}
        </Heading>
        
        <Text fontSize="md" color={textColor}>
          {rubric.content.description || 'No description provided.'}
        </Text>

        <Button 
          leftIcon={<FiEdit size="1em" />} 
          colorScheme="blue" 
          onClick={openEditModal}
          alignSelf="flex-start"
        >
          Edit Rubric
        </Button>

        <Accordion allowMultiple>
          {rubric.content.categories.map((category, categoryIndex) => (
            <AccordionItem key={categoryIndex}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    {category.name}
                    <Badge ml={2} colorScheme="blue">Weight: {category.weight * 100}%</Badge>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Box overflowX="auto">
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr>
                        {category.scoring_levels.map((level, levelIndex) => (
                          <Th key={levelIndex}>Level {level.level}</Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        {category.scoring_levels.map((level, levelIndex) => (
                          <Td key={levelIndex} style={{verticalAlign: "top"}}>
                            <Text fontWeight="bold" mb={1}>Score: {level.score}</Text>
                            <Text fontSize="sm">{level.description}</Text>
                          </Td>
                        ))}
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </VStack>
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} size="6xl">
        <ModalOverlay />
        <ModalContent      maxWidth="95vw" 
          margin="auto" 
          borderRadius="md">
          <ModalHeader>Edit Rubric</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel>Rubric Title</FormLabel>
                <Input 
                  name="title" 
                  value={editedRubric?.content.title || ''} 
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea 
                  name="description" 
                  value={editedRubric?.content.description || ''} 
                  onChange={handleInputChange}
                />
              </FormControl>
              <Divider />
              <Heading size="md">Categories</Heading>
              {editedRubric?.content.categories.map((category, categoryIndex) => (
                <Box key={categoryIndex} borderWidth={1} borderRadius="md" p={4}>
                  <HStack justify="space-between" mb={2}>
                    <FormControl>
                      <FormLabel>Category Name</FormLabel>
                      <Input
                        value={category.name}
                        onChange={(e) => handleCategoryChange(categoryIndex, 'name', e.target.value)}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Weight (%)</FormLabel>
                      <NumberInput
                        value={category.weight}
                        onChange={(_, value) => handleCategoryChange(categoryIndex, 'weight', value)}
                      >
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>
                    <IconButton
                      aria-label="Remove Category"
                      icon={<FiMinus />}
                      onClick={() => removeCategory(categoryIndex)}
                    />
                  </HStack>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Level</Th>
                        <Th>Score</Th>
                        <Th>Description</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {category.scoring_levels.map((level, levelIndex) => (
                        <Tr key={levelIndex}>
                          <Td>
                            <NumberInput
                              value={level.level}
                              onChange={(_, value) => handleScoringLevelChange(categoryIndex, levelIndex, 'level', value)}
                            >
                              <NumberInputField />
                            </NumberInput>
                          </Td>
                          <Td>
                            <NumberInput
                              value={level.score}
                              onChange={(_, value) => handleScoringLevelChange(categoryIndex, levelIndex, 'score', value)}
                            >
                              <NumberInputField />
                            </NumberInput>
                          </Td>
                          <Td>
                            <Input
                              value={level.description}
                              onChange={(e) => handleScoringLevelChange(categoryIndex, levelIndex, 'description', e.target.value)}
                            />
                          </Td>
                          <Td>
                            <IconButton
                              aria-label="Remove Level"
                              icon={<FiMinus />}
                              size="sm"
                              onClick={() => removeScoringLevel(categoryIndex, levelIndex)}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  <Button
                    leftIcon={<FiPlus />}
                    size="sm"
                    mt={2}
                    onClick={() => addScoringLevel(categoryIndex)}
                  >
                    Add Scoring Level
                  </Button>
                </Box>
              ))}
              <Button leftIcon={<FiPlus />} onClick={addCategory}>
                Add Category
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveRubric}>
              Save
            </Button>
            <Button variant="ghost" onClick={closeEditModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RubricDetailView;