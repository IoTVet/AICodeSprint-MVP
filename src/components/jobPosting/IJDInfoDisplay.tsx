import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Icon,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  useToast,
  Tooltip,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Fade,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { FiPlus, FiInfo, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { contextNoteService } from '../../api/services/jobPostingService';
import { IJDInfo, ContextNote } from "../../api/types";

const MotionBox = motion(Box);

interface IJDInfoDisplayProps {
  ijdInfo: IJDInfo;
  jobPostingId: number;
  isEditable: boolean;
  isPublic?: boolean;
}

const IJDInfoDisplay: React.FC<IJDInfoDisplayProps> = ({ ijdInfo, jobPostingId, isEditable, isPublic = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [contextCategory, setContextCategory] = useState('');
  const [contextContent, setContextContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [contextNotes, setContextNotes] = useState<ContextNote[]>([]);
  const toast = useToast();
  const accordionRef = useRef<HTMLDivElement>(null);

  const sections = [
    { title: 'Job Overview', content: ijdInfo?.jobOverview || [], icon: '📋' },
    { title: 'About the Organization', content: ijdInfo?.aboutTheOrg || [], icon: '🏢' },
    { title: 'Job Requirements', content: ijdInfo?.jobRequirements || [], icon: '📑' },
    { title: 'Job Responsibilities', content: ijdInfo?.jobResponsibilities || [], icon: '💼' },
    { title: 'Compensation', content: ijdInfo?.compensation || [], icon: '💰' },
  ];

  useEffect(() => {
    if (!isPublic){
      fetchContextNotes();
    }

  }, [jobPostingId]);

  const fetchContextNotes = async () => {
  try {
    const response = await contextNoteService.getAll(jobPostingId);
    console.log('Fetched context notes:', response.data);
    setContextNotes(response.data.results);
  } catch (error) {
    console.error('Error fetching context notes:', error);
    toast({
      title: 'Error fetching context notes',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
    setContextNotes([]);
  }
};

  const handleAddContext = (category: string, itemIndex: number) => {
    setContextCategory(category);
    setContextContent('');
    setEditingNoteId(null);
    setEditingItemIndex(itemIndex);
    onOpen();
  };

  const handleEditContext = (note: ContextNote) => {
    setContextCategory(note.category);
    setContextContent(note.content);
    setEditingNoteId(note.id);
    setEditingItemIndex(note.item_index);
    onOpen();
  };

  const handleSaveContext = async () => {
  try {
    let updatedNote: ContextNote;
    if (editingNoteId) {
      const response = await contextNoteService.update(editingNoteId, {
        category: contextCategory,
        content: contextContent,
        item_index: editingItemIndex!,
      });
      updatedNote = response.data;
      setContextNotes(prevNotes => prevNotes.map(note => note.id === editingNoteId ? updatedNote : note));
    } else {
      const response = await contextNoteService.create({
        job_posting: jobPostingId,
        category: contextCategory,
        content: contextContent,
        item_index: editingItemIndex!,
      });
      updatedNote = response.data;
      setContextNotes(prevNotes => [...prevNotes, updatedNote]);
    }
    toast({
      title: `Context ${editingNoteId ? 'updated' : 'added'} successfully`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onClose();
    fetchContextNotes(); // Refresh the context notes after saving
  } catch (error) {
    console.error('Error saving context:', error);
    toast({
      title: `Error ${editingNoteId ? 'updating' : 'adding'} context`,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};

  const handleDeleteContext = async (noteId: number) => {
  try {
    await contextNoteService.delete(noteId);
    toast({
      title: 'Context deleted successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    fetchContextNotes(); // Refresh the context notes after deleting
  } catch (error) {
    console.error('Error deleting context:', error);
    toast({
      title: 'Error deleting context',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};

  const getContextNotesForItem = (category: string, itemIndex: number) => {
  return contextNotes.filter(note => note.category === category && note.item_index === itemIndex);
};

  return (
    <VStack spacing={8} align="stretch" width="100%">
      {!isPublic && isEditable && (
        <Box bg="blue.50" p={4} borderRadius="md" mb={4}>
          <Text fontSize="sm" color="blue.700">
            <Icon as={FiInfo} mr={2} />
            Add context to help our AI assistant provide detailed information to potential applicants about this job.
          </Text>
        </Box>
      )}

      <Accordion allowToggle ref={accordionRef}>
        {sections.map((section, sectionIndex) => (
          <AccordionItem key={section.title} mb={2}>
            {({ isExpanded }) => (
              <>
                <AccordionButton
                  _expanded={{ bg: 'blue.50', color: 'blue.700' }}
                  borderRadius="md"
                  transition="all 0.2s"
                >
                  <Box flex="1" textAlign="left">
                    <Text fontSize="lg" fontWeight="bold">
                      {section.icon} {section.title}
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={2}>
                  <VStack align="stretch" spacing={2}>
                    <AnimatePresence>
                      {isExpanded &&
                        section.content.map((item, itemIndex) => (
                          <MotionBox
                            key={`${section.title}-${itemIndex}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, delay: itemIndex * 0.05 }}
                          >
                            <Box
                              borderWidth="1px"
                              borderRadius="md"
                              p={3}
                              bg="white"
                              boxShadow="sm"
                              _hover={{ boxShadow: "md" }}
                              transition="all 0.2s"
                            >
                              <Text fontSize="sm">{item}</Text>
                              {!isPublic && isEditable && (
                                <Tooltip label="Add context for AI assistant">
                                  <Button
                                    size="xs"
                                    colorScheme="blue"
                                    variant="ghost"
                                    leftIcon={<FiPlus />}
                                    mt={1}
                                    onClick={() => handleAddContext(section.title, itemIndex)}
                                  >
                                    Add Context
                                  </Button>
                                </Tooltip>
                              )}
                              {!isPublic && getContextNotesForItem(section.title, itemIndex).map((note) => (
                                <Fade in={true} key={note.id}>
                                  <Box mt={2} p={2} bg="gray.50" borderRadius="md">
                                    <Flex justify="space-between" align="center">
                                      <Text fontSize="xs" color="gray.600">
                                        {note.content}
                                      </Text>
                                      <Flex>
                                        <IconButton
                                          aria-label="Edit context"
                                          icon={<FiEdit2 />}
                                          size="xs"
                                          variant="ghost"
                                          onClick={() => handleEditContext(note)}
                                          mr={1}
                                        />
                                        <IconButton
                                          aria-label="Delete context"
                                          icon={<FiTrash2 />}
                                          size="xs"
                                          variant="ghost"
                                          onClick={() => handleDeleteContext(note.id)}
                                        />
                                      </Flex>
                                    </Flex>
                                  </Box>
                                </Fade>
                              ))}
                            </Box>
                          </MotionBox>
                        ))}
                    </AnimatePresence>
                  </VStack>
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        ))}
      </Accordion>

      {!isPublic && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{editingNoteId ? 'Edit Context' : 'Add Context'} for {contextCategory}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={4} fontSize="sm" color="gray.600">
                This context will help our AI assistant provide more detailed information to potential applicants.
              </Text>
              <Textarea
                value={contextContent}
                onChange={(e) => setContextContent(e.target.value)}
                placeholder="Enter additional context here..."
                rows={6}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSaveContext}>
                {editingNoteId ? 'Update' : 'Save'} Context
              </Button>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </VStack>
  );
};


export default IJDInfoDisplay;