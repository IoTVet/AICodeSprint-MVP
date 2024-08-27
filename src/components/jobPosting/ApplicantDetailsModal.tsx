import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Badge,
  Progress,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  useColorModeValue,
  Tooltip,
  Avatar,
  Link,
  Divider,
  List,
  ListItem,
  Grid,
  GridItem, Icon,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiLinkedin, FiGithub, FiGlobe, FiDownload, FiEdit, FiMessageSquare } from 'react-icons/fi';
import {Applicant, Evaluation, Resume, ParsedResumeInfo, Project, ApplicantNote, Rubric} from '../../api/types';
import {forEach} from "lodash";

interface ApplicantDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: Applicant;
  rubric: Rubric | null;
}

const ApplicantDetailsModal: React.FC<ApplicantDetailsModalProps> = ({ isOpen, onClose, applicant, rubric }) => {
  const [activeTab, setActiveTab] = useState(0);
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const cardBgColor = useColorModeValue('gray.50', 'gray.700');

  const MotionBox = motion(Box);

  const calculateOverallScore = (evaluation: Evaluation) => {

    return evaluation.overall_score;
  };

  const renderSkillBadges = (skills: string[] | undefined) => {
    return skills?.map((skill, index) => (
      <Badge key={index} colorScheme="blue" mr={2} mb={2}>
        {skill}
      </Badge>
    ));
  };

  const renderExperience = (experience: any[]) => {
    return experience.map((exp, index) => (
      <Box key={index} mb={4} p={4} bg={cardBgColor} borderRadius="md" boxShadow="sm">
        <Text fontWeight="bold">{exp.title}</Text>
        <Text>{exp.company}</Text>
        <Text fontSize="sm" color="gray.500">
          {exp.start_date} - {exp.end_date || 'Present'}
        </Text>
        <Text fontSize="sm" color="gray.500">{exp.location}</Text>
        <List styleType="disc" pl={4} mt={2}>
          {exp.description.map((item: string, idx: number) => (
            <ListItem key={idx}>{item}</ListItem>
          ))}
        </List>
      </Box>
    ));
  };

  console.log(applicant)

  const renderProjects = (projects: Project[] | undefined) => {
      return projects?.map((project, index) => (
      <Box key={index} mb={4} p={4} bg={cardBgColor} borderRadius="md" boxShadow="sm">
        <Text fontWeight="bold">{project.name}</Text>
        <Text fontSize="sm" mb={2}>{project.description}</Text>
        <HStack wrap="wrap">
          {project.technologies.map((tech, idx) => (
            <Badge key={idx} colorScheme="green">{tech}</Badge>
          ))}
        </HStack>
        {project.url && (
          <Link href={project.url} isExternal color="blue.500" mt={2}>
            Project Link
          </Link>
        )}
      </Box>
    ));
  };

  const renderEvaluationResults = (evaluation: Evaluation) => {
  return evaluation.content.evaluations.map((evalItem, index) => (
    <Box key={index} mb={6} bg={cardBgColor} p={4} borderRadius="md" boxShadow="sm">
      <Text fontWeight="bold" mb={2}>{evalItem.category}</Text>
      <Flex align="center" mb={2}>
        <Progress value={(evalItem.score / 10) * 100} colorScheme="green" size="sm" flex={1} mr={4} />
        <Text fontWeight="bold">{evalItem.score}/10</Text>
      </Flex>
      <Text fontSize="sm">{evalItem.justification}</Text>
    </Box>
  ));
};

  const renderNotes = (notes: ApplicantNote[]) => {
    return notes.map((note, index) => (
      <Box key={index} mb={4} p={4} bg={cardBgColor} borderRadius="md" boxShadow="sm">
        <Flex justify="space-between" align="center" mb={2}>
          <Text fontWeight="bold">{note.author}</Text>
          <Text fontSize="sm" color="gray.500">{new Date(note.created_at).toLocaleString()}</Text>
        </Flex>
        <Text>{note.content}</Text>
      </Box>
    ));
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent bg={bgColor} maxWidth="95vw">
        <ModalHeader>
          <Flex justify="space-between" align="center">
            <HStack spacing={4}>
              <Avatar name={`${applicant.first_name} ${applicant.last_name}`} size="xl" />
              <VStack align="start" spacing={0}>
                <Text fontSize="3xl" fontWeight="bold">{`${applicant.first_name} ${applicant.last_name}`}</Text>
                <Text fontSize="lg" color="gray.500">{applicant.current_position || applicant?.resume?.parsed_info?.education_level}</Text>
              </VStack>
            </HStack>
            <HStack>
              <Tooltip label="Download Resume">
                <Button size="sm" colorScheme="blue" leftIcon={<FiDownload />}>Resume</Button>
              </Tooltip>
              <Tooltip label="Edit Applicant">
                <Button size="sm" colorScheme="gray" leftIcon={<FiEdit />}>Edit</Button>
              </Tooltip>
              <Tooltip label="Send Message">
                <Button size="sm" colorScheme="green" leftIcon={<FiMessageSquare />}>Message</Button>
              </Tooltip>
            </HStack>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs isFitted variant="enclosed" onChange={(index) => setActiveTab(index)} mb={6}>
            <TabList>
              <Tab>Overview</Tab>
              <Tab>Experience & Projects</Tab>
              <Tab>Evaluation</Tab>
              <Tab>Resume</Tab>
              <Tab>Notes</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <AnimatePresence mode='wait'>
                  <MotionBox
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                      <GridItem colSpan={1}>
                        <VStack align="stretch" spacing={6}>
                          <Box bg={cardBgColor} p={4} borderRadius="md" boxShadow="sm">
                            <Text fontSize="lg" fontWeight="bold" mb={2}>Contact Information</Text>
                            <VStack align="start" spacing={2}>
                              <Flex align="center">
                                <Icon as={FiMail} mr={2} />
                                <Text>{applicant.email}</Text>
                              </Flex>
                              <Flex align="center">
                                <Icon as={FiPhone} mr={2} />
                                <Text>{applicant.phone}</Text>
                              </Flex>
                              {applicant.linkedin_url && (
                                <Flex align="center">
                                  <Icon as={FiLinkedin} mr={2} />
                                  <Link href={applicant.linkedin_url} isExternal>LinkedIn</Link>
                                </Flex>
                              )}
                              {applicant.github_url && (
                                <Flex align="center">
                                  <Icon as={FiGithub} mr={2} />
                                  <Link href={applicant.github_url} isExternal>GitHub</Link>
                                </Flex>
                              )}
                              {applicant.portfolio_url && (
                                <Flex align="center">
                                  <Icon as={FiGlobe} mr={2} />
                                  <Link href={applicant.portfolio_url} isExternal>Portfolio</Link>
                                </Flex>
                              )}
                            </VStack>
                          </Box>
                          <Box bg={cardBgColor} p={4} borderRadius="md" boxShadow="sm">
                            <Text fontSize="lg" fontWeight="bold" mb={2}>Skills</Text>
                            <Flex flexWrap="wrap">
                              {renderSkillBadges(applicant.resume.parsed_info.skills)}
                            </Flex>
                          </Box>
                          {applicant?.resume?.parsed_info?.languages?.length! > 0 && (
                            <Box bg={cardBgColor} p={4} borderRadius="md" boxShadow="sm">
                              <Text fontSize="lg" fontWeight="bold" mb={2}>Languages</Text>
                              <Flex flexWrap="wrap">
                                {renderSkillBadges(applicant?.resume?.parsed_info?.languages)}
                              </Flex>
                            </Box>
                          )}
                          {applicant?.resume?.parsed_info?.certifications?.length! > 0 && (
                            <Box bg={cardBgColor} p={4} borderRadius="md" boxShadow="sm">
                              <Text fontSize="lg" fontWeight="bold" mb={2}>Certifications</Text>
                              <List styleType="disc" pl={4}>
                                {applicant?.resume?.parsed_info?.certifications?.map((cert, index) => (
                                  <ListItem key={index}>{cert}</ListItem>
                                ))}
                              </List>
                            </Box>
                          )}
                        </VStack>
                      </GridItem>
                      <GridItem colSpan={2}>
                        <Box bg={cardBgColor} p={4} borderRadius="md" boxShadow="sm">
                          <Text fontSize="lg" fontWeight="bold" mb={4}>Education</Text>
                          {applicant?.resume?.parsed_info?.education?.map((edu, index) => (
                            <Box key={index} mb={index < applicant?.resume?.parsed_info?.education!.length - 1 ? 4 : 0}>
                              <Text fontWeight="bold">{edu.degree}</Text>
                              <Text>{edu.institution}</Text>
                              <Text fontSize="sm" color="gray.500">
                                {edu.start_date} - {edu.end_date || 'Present'}
                              </Text>
                              <Text fontSize="sm" color="gray.500">{edu.location}</Text>
                              {edu.gpa && (
                                <Text fontSize="sm">GPA: {edu.gpa}</Text>
                              )}
                            </Box>
                          ))}
                        </Box>
                      </GridItem>
                    </Grid>
                  </MotionBox>
                </AnimatePresence>
              </TabPanel>
              <TabPanel>
                <AnimatePresence mode={'wait'}>
                  <MotionBox
                    key="experience-projects"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <VStack align="stretch" spacing={6}>
                      <Box>
                        <Text fontSize="xl" fontWeight="bold" mb={4}>Experience</Text>
                        {renderExperience(applicant.resume.parsed_info.experience)}
                      </Box>
                      <Divider />
                      <Box>
                        <Text fontSize="xl" fontWeight="bold" mb={4}>Projects</Text>
                        {renderProjects(applicant.resume.parsed_info.projects)}
                      </Box>
                    </VStack>
                  </MotionBox>
                </AnimatePresence>
              </TabPanel>
              <TabPanel>
                <AnimatePresence mode={'wait'}>
                  <MotionBox
                    key="evaluation"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {applicant.evaluation ? (
                      <VStack align="stretch" spacing={6}>
                        <Box bg={cardBgColor} p={6} borderRadius="md" boxShadow="md">
                          <Text fontSize="2xl" fontWeight="bold" mb={4}>Overall Evaluation</Text>
                          <Flex align="center" justify="space-between" mb={4}>
                            <Progress value={calculateOverallScore(applicant.evaluation)} size="lg" colorScheme="green" width="80%" />
                            <Text fontSize="3xl" fontWeight="bold">
                              {calculateOverallScore(applicant.evaluation).toFixed(1)}%
                            </Text>
                          </Flex>
                          <HStack spacing={4}>
                            <Badge colorScheme={applicant.evaluation.human_approved ? "green" : "yellow"}>
                              {applicant.evaluation.human_approved ? "Human Approved" : "Pending Approval"}
                            </Badge>
                            {applicant.evaluation.approved_at && (
                              <Text fontSize="sm" color="gray.500">
                                Approved on: {new Date(applicant.evaluation.approved_at).toLocaleDateString()}
                              </Text>
                            )}
                          </HStack>
                        </Box>
                        <Box>
                          <Text fontSize="xl" fontWeight="bold" mb={4}>Evaluation Details</Text>
                          {renderEvaluationResults(applicant.evaluation)}
                        </Box>
                        <Box bg={cardBgColor} p={6} borderRadius="md" boxShadow="md">
                          <Text fontSize="xl" fontWeight="bold" mb={2}>Overall Assessment</Text>
                          <Text>{applicant.evaluation.content.overall_assessment}</Text>
                        </Box>
                      </VStack>
                    ) : (
                      <Text>No evaluation data available.</Text>
                    )}
                  </MotionBox>
                </AnimatePresence>
              </TabPanel>
              <TabPanel>
                <AnimatePresence mode={'wait'}>
                  <MotionBox
                    key="resume"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box
                      border="1px"
                      borderColor={borderColor}
                      borderRadius="md"
                      p={4}
                      height="60vh"
                      overflowY="auto"
                    >
                      <Text whiteSpace="pre-wrap">{applicant.resume.full_text}</Text>
                    </Box>
                  </MotionBox>
                </AnimatePresence>
              </TabPanel>
              <TabPanel>
                <AnimatePresence mode={'wait'}>
                  <MotionBox
                    key="notes"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <VStack align="stretch" spacing={4}>
                      <Flex justify="space-between" align="center">
                        <Text fontSize="xl" fontWeight="bold">Interviewer Notes</Text>
                        <Button leftIcon={<FiEdit />} colorScheme="blue" size="sm">Add Note</Button>
                      </Flex>
                      {applicant.notes && applicant.notes.length > 0 ? (
                        renderNotes(applicant.notes)
                      ) : (
                        <Text color="gray.500">No notes available for this applicant.</Text>
                      )}
                    </VStack>
                  </MotionBox>
                </AnimatePresence>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ApplicantDetailsModal;