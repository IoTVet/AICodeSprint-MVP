import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Flex,
  Icon,
  useTheme,
} from "@chakra-ui/react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  const theme = useTheme();

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 500 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onCancel} isCentered motionPreset="scale">
          <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
          <ModalContent
            as={motion.div}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            maxW="md"
          >
            <ModalHeader paddingBottom={0}>
              <Flex align="center">
                <Icon as={FiAlertTriangle} color="yellow.500" boxSize={6} marginRight={3} />
                <Text fontSize="2xl" fontWeight="bold">{title}</Text>
              </Flex>
            </ModalHeader>
            <ModalCloseButton size="lg" />
            <ModalBody>
              <Text fontSize="lg" color="gray.600">{message}</Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onCancel} fontSize="md">
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={onConfirm}
                fontSize="md"
                _hover={{ bg: "red.600" }}
                _active={{ bg: "red.700" }}
              >
                Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;