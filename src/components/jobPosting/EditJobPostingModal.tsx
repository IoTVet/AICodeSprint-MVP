// components/jobPosting/EditJobPostingModal.tsx

import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  FormControl,
  FormLabel,
  Button,
  Divider,
  Box,
  Heading,
} from "@chakra-ui/react";
import { Input } from '../common/Input';
import { Textarea } from '../common/TextArea';
import {IJDInfo, JobPosting} from '../../api/types';
import flattenCamelCase from '../../helpers/flattenCamelCase';

interface EditJobPostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobPosting: JobPosting & { ijd_info: IJDInfo };
  onSave: (updatedJobPosting: JobPosting & { ijd_info: IJDInfo }) => void;
}

const EditJobPostingModal: React.FC<EditJobPostingModalProps> = ({ isOpen, onClose, jobPosting, onSave }) => {
  const [editedJobPosting, setEditedJobPosting] = useState<JobPosting>(jobPosting);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedJobPosting(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIJDInfoChange = (category: keyof IJDInfo, index: number, value: string) => {
  setEditedJobPosting(prev => ({
    ...prev,
    ijd_info: {
      ...prev.ijd_info,
      [category]: (prev.ijd_info[category] as string[]).map((item: string, i: number) =>
        i === index ? value : item
      ),
    },
  }));
};

  const handleSave = () => {
    onSave(editedJobPosting);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="full"
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent 
        maxWidth="95vw" 
        maxHeight="95vh" 
        margin="auto" 
        borderRadius="md"
      >
        <ModalHeader>Edit Job Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto">
          <VStack spacing={6} align="stretch">
            <FormControl>
              <FormLabel>Job Title</FormLabel>
              <Input 
                name="title" 
                value={editedJobPosting.title} 
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Company</FormLabel>
              <Input 
                name="company.name" 
                value={editedJobPosting.company.name} 
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Location</FormLabel>
              <Input 
                name="location" 
                value={editedJobPosting.location} 
                onChange={handleInputChange}
              />
            </FormControl>
            <Divider />
            {Object.entries(editedJobPosting.ijd_info).map(([category, items]) => (
              <Box key={category}>
                <Heading size="md" mb={2}>{flattenCamelCase(category)}</Heading>
                {Array.isArray(items) && items.map((item: string, index: number) => (
                  <FormControl key={index} mb={2}>
                    <FormLabel>{`${flattenCamelCase(category)} item ${index + 1}`}</FormLabel>
                    <Textarea
                      value={item}
                      onChange={(e) => handleIJDInfoChange(category as keyof IJDInfo, index, e.target.value)}
                    />
                  </FormControl>
                ))}
              </Box>
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditJobPostingModal;