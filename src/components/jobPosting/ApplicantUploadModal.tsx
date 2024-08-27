import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Textarea,
  Box,
  Flex,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiFileText, FiCheckCircle } from 'react-icons/fi';

interface ApplicantUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobPostingId: number;
  onUploadSuccess: (formData: FormData) => void;
}

const ApplicantUploadModal: React.FC<ApplicantUploadModalProps> = ({
  isOpen,
  onClose,
  jobPostingId,
  onUploadSuccess,
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [manualInput, setManualInput] = useState({ name: '', email: '', resumeText: '' });
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    onDrop: (acceptedFiles) => {
      setUploadedFile(acceptedFiles[0]);
    },
  });

  const handleSubmit = (type: 'file' | 'manual') => {
    const formData = new FormData();
    formData.append('job_posting', jobPostingId.toString());

    if (type === 'file') {
      if (!uploadedFile) {
        toast({ title: 'Please upload a resume file', status: 'error' });
        return;
      }
      formData.append('resume', uploadedFile);
    } else {
      if (!manualInput.name || !manualInput.email || !manualInput.resumeText) {
        toast({ title: 'Please fill in all fields', status: 'error' });
        return;
      }
      formData.append('name', manualInput.name);
      formData.append('email', manualInput.email);
      formData.append('resume_text', manualInput.resumeText);
    }

    onUploadSuccess(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent
        as={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <ModalHeader>Add New Applicant</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab>Upload Resume</Tab>
              <Tab>Manual Input</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <VStack spacing={4}>
                  <Box
                    {...getRootProps()}
                    w="100%"
                    h="200px"
                    border="2px dashed"
                    borderColor={borderColor}
                    borderRadius="md"
                    p={4}
                    cursor="pointer"
                    bg={bgColor}
                    transition="all 0.3s"
                    _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <input {...getInputProps()} />
                    <AnimatePresence>
                      {uploadedFile ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <Flex alignItems="center">
                            <Icon as={FiCheckCircle} color="green.500" boxSize={6} mr={2} />
                            <Text>{uploadedFile.name}</Text>
                          </Flex>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <Icon as={FiUpload} boxSize={10} mb={2} />
                          <Text>
                            {isDragActive
                              ? "Drop the resume file here"
                              : "Drag and drop a resume file here, or click to select"}
                          </Text>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack spacing={4}>
                  <Input
                    placeholder="Applicant Name"
                    value={manualInput.name}
                    onChange={(e) => setManualInput({ ...manualInput, name: e.target.value })}
                  />
                  <Input
                    placeholder="Applicant Email"
                    type="email"
                    value={manualInput.email}
                    onChange={(e) => setManualInput({ ...manualInput, email: e.target.value })}
                  />
                  <Textarea
                    placeholder="Paste resume text here"
                    value={manualInput.resumeText}
                    onChange={(e) => setManualInput({ ...manualInput, resumeText: e.target.value })}
                    minHeight="200px"
                  />
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => handleSubmit(manualInput.resumeText ? 'manual' : 'file')}>
            Add Applicant
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ApplicantUploadModal;