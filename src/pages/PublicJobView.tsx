// PublicJobView.tsx
import React, { useState } from 'react';
import {
  Box, Container, VStack, Heading, Text, Flex, Icon, HStack, Button, Badge, useColorModeValue, SimpleGrid, Tooltip, useToast,
} from "@chakra-ui/react";
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiDollarSign, FiClock, FiShare2, FiBriefcase } from 'react-icons/fi';
import IJDInfoDisplay from '../components/jobPosting/IJDInfoDisplay';
import { JobPosting } from "../api/types";
import ChatComponent from "../components/jobPosting/ChatComponent";

const MotionBox = motion(Box);

interface PublicJobViewProps {
  jobPosting: JobPosting;
}

const PublicJobView: React.FC<PublicJobViewProps> = ({ jobPosting }) => {
  const [isApplying, setIsApplying] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  const handleShare = () => {
    const publicUrl = `${window.location.origin}/job/${jobPosting.id}`;
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: "Link Copied",
      description: "Public job posting link has been copied to clipboard.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleApply = () => {
    setIsApplying(true);
    // Here you would typically redirect to an application form or open a modal
    // For now, we'll just toggle the state
    setTimeout(() => setIsApplying(false), 2000);
  };

  return (
    <Box bg={bgColor} minHeight="100vh">
      <Container maxW="container.xl" py={8}>
        <Flex direction={{ base: 'column', xl: 'row' }} gap={8}>
          <VStack spacing={8} align="stretch" flex={1} maxW={{ xl: '50%' }}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap">
                <VStack align="start" spacing={2}>
                  <Heading as="h1" size="2xl" color={textColor}>
                    {jobPosting.title}
                  </Heading>
                  <HStack>
                    <Badge colorScheme="green" fontSize="md" px={2} py={1}>
                      {jobPosting.status}
                    </Badge>
                    <Text fontSize="xl" color={textColor} fontWeight="bold">
                      {jobPosting.company.name}
                    </Text>
                  </HStack>
                </VStack>
                <HStack>
                  <Tooltip label="Share job posting">
                    <Button leftIcon={<FiShare2 />} onClick={handleShare} colorScheme="blue" variant="outline">
                      Share
                    </Button>
                  </Tooltip>
                  <Button
                    leftIcon={<FiBriefcase />}
                    onClick={handleApply}
                    colorScheme="green"
                    isLoading={isApplying}
                  >
                    Apply Now
                  </Button>
                </HStack>
              </Flex>
            </MotionBox>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <InfoCard icon={FiMapPin} label="Location" value={jobPosting.location || 'Remote'} />
              <InfoCard icon={FiDollarSign} label="Salary" value={jobPosting.salary_range || 'Competitive'} />
              <InfoCard icon={FiCalendar} label="Posted On" value={new Date(jobPosting.created_at).toLocaleDateString()} />
              <InfoCard icon={FiClock} label="Application Deadline" value={new Date(jobPosting.deadline).toLocaleDateString()} />
            </SimpleGrid>

            <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="md">
              <Heading as="h2" size="lg" mb={4}>Job Details</Heading>
              <IJDInfoDisplay
                jobPostingId={jobPosting.id}
                ijdInfo={jobPosting.ijd_info}
                isEditable={false}
                isPublic={true}
              />
            </Box>
          </VStack>

          <Box flex={1} position="sticky" top="20px" alignSelf="flex-start" maxW={{ xl: '100%' }} w="100%">
            <ChatComponent jobPosting={jobPosting} />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

const InfoCard: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({ icon, label, value }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box bg={bgColor} p={4} borderRadius="md" boxShadow="sm">
      <HStack spacing={4}>
        <Icon as={icon} boxSize={6} color="blue.500" />
        <VStack align="start" spacing={0}>
          <Text fontSize="sm" color="gray.500">{label}</Text>
          <Text fontSize="md" fontWeight="bold" color={textColor}>{value}</Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default PublicJobView;