import { FiAlertTriangle, FiCheck } from 'react-icons/fi';
import {Box, Button, Flex, Icon, Text, useColorModeValue} from "@chakra-ui/react";
import { motion } from 'framer-motion';
import React from 'react';
interface RubricApprovalBannerProps {
  onApprove: () => void;
}

const RubricApprovalBanner: React.FC<RubricApprovalBannerProps> = ({ onApprove }) => {
  const bgColor = useColorModeValue('yellow.100', 'yellow.800');
  const borderColor = useColorModeValue('yellow.500', 'yellow.600');
  const textColor = useColorModeValue('yellow.800', 'yellow.100');
  const buttonBgColor = useColorModeValue('yellow.500', 'yellow.600');
  const buttonHoverBgColor = useColorModeValue('yellow.600', 'yellow.700');

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        bg={bgColor}
        border="2px"
        borderColor={borderColor}
        color={textColor}
        p={4}
        mb={6}
        borderRadius="lg"
        boxShadow="md"
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <Icon as={FiAlertTriangle} w={6} h={6} mr={3} />
            <Box>
              <Text fontWeight="bold">Rubric Needs Approval</Text>
              <Text>Please review and approve the rubric before proceeding.</Text>
            </Box>
          </Flex>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              leftIcon={<Icon as={FiCheck} />}
              onClick={onApprove}
              bg={buttonBgColor}
              color="white"
              _hover={{ bg: buttonHoverBgColor }}
              fontWeight="bold"
              transition="background-color 0.3s ease-in-out"
            >
              Approve Rubric
            </Button>
          </motion.div>
        </Flex>
      </Box>
    </motion.div>
  );
};

export default RubricApprovalBanner;