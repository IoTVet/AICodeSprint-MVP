import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FiChevronUp, FiCalendar, FiUsers, FiClock, FiEdit, FiTrash2,
  FiBarChart2, FiUpload, FiFileText, FiClipboard,
  FiDollarSign, FiMapPin, FiArrowLeft,
  FiShare2, FiEye
} from 'react-icons/fi';

import { jobPostingService, applicantService, rubricService } from '../../api/services/jobPostingService';
import {JobPosting, Applicant, Rubric, IJDInfo} from "../../api/types";

import IJDInfoDisplay from './IJDInfoDisplay';
import ApplicantUpload from './ApplicantUpload';
import ApplicantList from './ApplicantList';
import AnalyticsModal from './AnalyticsModal';
import RubricEditModal from '../Rubrics/RubricEditModal';
import ConfirmationModal from "./ConfirmationModal";
import DatePickerModal from "./DatePickerModal";
import FloatingActionButton from "../common/FloatingActionButton";
import ApplicantDetailsModal from './ApplicantDetailsModal';
import {
  Box,
  Button, CloseButton,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner,
  Tab,
  TabList, TabPanel, TabPanels,
  Tabs,
  Text,
  useClipboard,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import RubricApprovalBanner from "../Rubrics/RubricApprovalBanner";
import RubricDetailView from "../Rubrics/RubricDetailView";
import RubricHistoryTimeline from "../Rubrics/RubricHistoryTimeline";
import ChatBox from '../ChatBox';
import { Input } from '../common/Input';
import { Textarea } from '../common/TextArea';
import flattenCamelCase from '../../helpers/flattenCamelCase';
import LoadingAnimation from '../common/LoadingAnimation';
import MiniLoadingAnimation from '../common/MiniLoadingAnimation';
import EditJobPostingModal from './EditJobPostingModal';
import ApplicantsList from './ApplicantList';
import { Tooltip } from '@chakra-ui/react';
import PublicJobView from "../../pages/PublicJobView";

interface JobPostingFullViewProps {
  jobPosting: JobPosting;
  onClose: () => void;
  initialTab?: string;
}

const JobPostingFullView: React.FC<JobPostingFullViewProps> = ({ jobPosting, onClose, initialTab = 'details' }) => {
  const navigate = useNavigate();
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [isLoadingRubric, setIsLoadingRubric] = useState(true);
  const [showRubricEditModal, setShowRubricEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showApplicantUploadModal, setShowApplicantUploadModal] = useState(false);
  const [isCloseConfirmationOpen, setIsCloseConfirmationOpen] = useState(false);
  const [isExtendDeadlineOpen, setIsExtendDeadlineOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [tabIndex, setTabIndex] = useState(0);


  const [shareableLink, setShareableLink] = useState('');

  useEffect(() => {
    // Set the initial tab index based on the initialTab prop
    switch (initialTab) {
      case 'rubric':
        setTabIndex(1);
        break;
      case 'applicants':
        setTabIndex(2);
        break;
      default:
        setTabIndex(0);
    }
  }, [initialTab]);

  const { hasCopied, onCopy } = useClipboard(`${window.location.origin}/job/${jobPosting.id}`);

  const handleCopyLink = () => {
    onCopy();
    toast.success('Public link copied to clipboard!');
  };

  const handleViewApplicant = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    // You might want to open a modal or navigate to a new page here
  };

  const bgGradient = useColorModeValue(
    'linear(to-r, blue.500, purple.500)',
    'linear(to-r, blue.200, purple.200)'
  );
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  const fetchRubric = useCallback(async () => {
    setIsLoadingRubric(true);
    try {
      const response = await rubricService.getByJobPostingId(jobPosting.id);
      setRubric(response.data);
    } catch (error) {
      console.error('Error fetching rubric:', error);
      toast.error('Error fetching rubric');
    } finally {
      setIsLoadingRubric(false);
    }
  }, [jobPosting.id]);

  const fetchApplicants = async () => {
    try {
      const response = await applicantService.getAll(jobPosting.id, { page: 1 });
      setApplicants(response.data.results);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      toast.error('Error fetching applicants');
    }
  };

  useEffect(() => {
    fetchRubric();
    fetchApplicants();
  }, [jobPosting.id, fetchRubric]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedJobPosting, setEditedJobPosting] = useState<JobPosting>(jobPosting);

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const handleSaveDetails = () => {
    console.log("Saving edited job posting details:", editedJobPosting);
    closeEditModal();
  };

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

  const handleRubricUpdate = async (updatedRubric: Rubric) => {
    try {
      await rubricService.update(updatedRubric);
      setRubric(updatedRubric);
      setShowRubricEditModal(false);
      toast.success('Rubric updated successfully');
    } catch (error) {
      console.error('Error updating rubric:', error);
      toast.error('Error updating rubric');
    }
  };

  const handleCloseJobPosting = async () => {
    try {
      await jobPostingService.close(jobPosting.id);
      toast.success('Job posting closed successfully');
      setIsCloseConfirmationOpen(false);
      onClose();
    } catch (error) {
      console.error('Error closing job posting:', error);
      toast.error('Error closing job posting');
    }
  };

  const handleExtendDeadline = async (newDeadline: Date) => {
    try {
      await jobPostingService.extendDeadline(jobPosting.id, newDeadline.toISOString());
      toast.success('Deadline extended successfully');
      setIsExtendDeadlineOpen(false);
    } catch (error) {
      console.error('Error extending deadline:', error);
      toast.error('Error extending deadline');
    }
  };


  return (
    <Flex height="100vh" width="100vw">
    <Box
      position="fixed"
      top={0}
      left={0}
      bottom={0}
      bg={bgColor}
      zIndex={1000}
      width="100%"
      overflowY="auto"
    >
      <ToastContainer />

      <Box bgGradient={bgGradient} color="white" py={8} px={4} position="relative">
        <CloseButton
          onClick={onClose}
          position="absolute"
          right={4}
          top={4}
          size="lg"
        />
        <VStack spacing={2} align="stretch" maxW="7xl" mx="auto">
          <Heading as="h1" size="2xl">{jobPosting.title}</Heading>
          <Text fontSize="xl">{jobPosting.company.name}</Text>
          <HStack spacing={4} fontSize="sm" flexWrap="wrap">
            <Flex align="center"><Icon as={FiCalendar} mr={2} /> Posted: {new Date(jobPosting.created_at).toLocaleDateString()}</Flex>
            <Flex align="center"><Icon as={FiClock} mr={2} /> Deadline: {new Date(jobPosting.deadline).toLocaleDateString()}</Flex>
            <Flex align="center"><Icon as={FiMapPin} mr={2} /> {jobPosting.location || 'Remote'}</Flex>
            <Flex align="center"><Icon as={FiUsers} mr={2} /> {applicants.length} Applicants</Flex>
            <Flex align="center"><Icon as={FiDollarSign} mr={2} /> {jobPosting.salary_range || 'Competitive'}</Flex>
          </HStack>
          <Tooltip label={hasCopied ? 'Copied!' : 'Copy shareable link'}>
            <Button
              leftIcon={<FiShare2 />}
              onClick={handleCopyLink}
              colorScheme="green"
              size="sm"
              mt={2}
            >
              Share Job
            </Button>
          </Tooltip>
        </VStack>
      </Box>

      <Box maxW="7xl" mx="auto" px={4} py={8}>
          <Tabs isFitted variant="enclosed" index={tabIndex} onChange={(index) => {
            setTabIndex(index);
            setActiveTab(index === 0 ? 'details' : index === 1 ? 'rubric' : index === 2 ? 'applicants' : 'public');
          }}>
            <TabList mb="1em">
              <Tab><Icon as={FiFileText} mr={2} /> Details</Tab>
              <Tab><Icon as={FiClipboard} mr={2} /> Rubric</Tab>
              <Tab><Icon as={FiUsers} mr={2} /> Applicants</Tab>
              <Tab><Icon as={FiEye} mr={2} /> Public View</Tab>
            </TabList>
            <TabPanels>
            <TabPanel>
            <Button 
                leftIcon={<FiEdit size="1em" />} 
                colorScheme="blue" 
                onClick={openEditModal}
                alignSelf="flex-start"
              >
                Edit Details
              </Button>
              <IJDInfoDisplay
                ijdInfo={jobPosting.ijd_info}
                jobPostingId={jobPosting.id}
                isEditable={true}
              />
            </TabPanel>
            <TabPanel>
              <VStack spacing={4} align="stretch">
                {isLoadingRubric ? (
                  <Box textAlign="center" py={10}>
                     <MiniLoadingAnimation />
                  </Box>
                ) : rubric ? (
                  <>
                    {/*!rubric.human_approved && (*/}
                    {/*{<RubricApprovalBanner onApprove={handleApproveRubric} />*!/*/}
                    {/*)} */}
                    <RubricDetailView
                      rubric={rubric}
                    />
                    {/* <RubricHistoryTimeline jobPostingId={jobPosting.id} /> */}
                  </>
                ) : (
                  <Text color={textColor}>No rubric available for this job posting.</Text>
                )}
              </VStack>
            </TabPanel>
            <TabPanel>
              <ApplicantsList
                jobPosting={jobPosting}
                applicants={applicants}
                rubric={rubric!}
                onViewApplicant={handleViewApplicant}
                onRefresh={fetchApplicants}
              />
              </TabPanel>
          <TabPanel>
                <PublicJobView jobPosting={jobPosting} />
              </TabPanel>
            </TabPanels>
        </Tabs>
      </Box>

      {/* <FloatingActionButton
        actions={[
          {
            icon: <Icon as={FiUpload} />,
            label: 'Upload Resume',
            onClick: () => setShowApplicantUploadModal(true),
          },
          {
            icon: <Icon as={FiBarChart2} />,
            label: 'View Analytics',
            onClick: () => setShowAnalyticsModal(true),
          },
          {
            icon: <Icon as={FiEdit} />,
            label: 'Edit Rubric',
            onClick: () => setShowRubricEditModal(true),
          },
          {
            icon: <Icon as={FiClock} />,
            label: 'Extend Deadline',
            onClick: () => setIsExtendDeadlineOpen(true),
          },
          {
            icon: <Icon as={FiTrash2} />,
            label: 'Close Job Posting',
            onClick: () => setIsCloseConfirmationOpen(true),
          },
        ]}
      /> */}

      <AnimatePresence>
        {showAnalyticsModal && (
          <AnalyticsModal
            jobPosting={jobPosting}
            applicants={applicants}
            onClose={() => setShowAnalyticsModal(false)}
          />
        )}

        {showApplicantUploadModal && (
          <ApplicantUpload
            jobPostingId={jobPosting.id}
            onUploadSuccess={() => {
              fetchApplicants();
              setShowApplicantUploadModal(false);
            }}
            onClose={() => setShowApplicantUploadModal(false)}
          />
        )}

        {showRubricEditModal && rubric && (
          <RubricEditModal
            rubric={rubric}
            onSave={handleRubricUpdate}
            onClose={() => setShowRubricEditModal(false)}
          />
        )}

        {isCloseConfirmationOpen && (
          <ConfirmationModal
            isOpen={isCloseConfirmationOpen}
            title="Close Job Posting"
            message="Are you sure you want to close this job posting? This action cannot be undone."
            onConfirm={handleCloseJobPosting}
            onCancel={() => setIsCloseConfirmationOpen(false)}
          />
        )}

        {isExtendDeadlineOpen && (
          <DatePickerModal
            isOpen={isExtendDeadlineOpen}
            title="Extend Deadline"
            onConfirm={handleExtendDeadline}
            onCancel={() => setIsExtendDeadlineOpen(false)}
          />
        )}

        {selectedApplicant && (
          <ApplicantDetailsModal
            applicant={selectedApplicant}
            rubric={rubric}
            isOpen={true}
            onClose={() => setSelectedApplicant(null)}
          />
        )}
      </AnimatePresence>
    </Box>
      <EditJobPostingModal 
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        jobPosting={jobPosting}
        onSave={handleSaveDetails}
      />
    </Flex>
  );
};

export default JobPostingFullView;