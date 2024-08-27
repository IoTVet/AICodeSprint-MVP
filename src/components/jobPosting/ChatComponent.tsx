import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  Flex,
  Icon,
  HStack,
  Button,
  Input,
  List,
  ListItem,
  Spinner,
  Avatar,
  Divider,
  useDisclosure,
  Tooltip,
  keyframes,
  Skeleton, Link,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiSend, FiHelpCircle, FiUser, FiRefreshCw } from 'react-icons/fi';
import { getSuggestedQuestions, createChatSession, sendChatMessage, getChatHistory, generateSuggestedQuestions } from '../../api/services/chatbotService';
import {JobPosting} from "../../api/types";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styled from "styled-components";
import MarkdownContent from "../common/MarkdownContent";


const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);

const pulseAnimation = keyframes`
  0% { transform: scale(0.95); }
  50% { transform: scale(1.05); }
  100% { transform: scale(0.95); }
`;

const PulsingSkeleton = () => (
  <Skeleton
    height="40px"
    width="100%"
    borderRadius="md"
    startColor="blue.100"
    endColor="blue.300"
    speed={1}
    animation={`${pulseAnimation} 2s ease-in-out infinite`}
  />
);

const ChatComponent: React.FC<{ jobPosting: JobPosting }> = ({ jobPosting }) => {
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const { isOpen: isSuggestionsOpen, onToggle: onToggleSuggestions } = useDisclosure({ defaultIsOpen: true });

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');


  const renderMessage = (message: { role: 'user' | 'assistant', content: string }) => (
    <MotionFlex
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      mb={4}
      justifyContent={message.role === 'user' ? 'flex-end' : 'flex-start'}
    >
      {message.role === 'assistant' && (
        <Avatar size="sm" bg="blue.500" icon={<FiMessageCircle />} mr={2} />
      )}
      <MotionBox
        bg={message.role === 'user' ? 'blue.500' : 'gray.100'}
        color={message.role === 'user' ? 'white' : 'black'}
        py={2}
        px={4}
        borderRadius="lg"
        maxW="75%"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {message.role === 'user' ? (
          <Text>{message.content}</Text>
        ) : (
          <MarkdownContent>
            {message.content}
          </MarkdownContent>
        )}
        </MotionBox>
      {message.role === 'user' && (
        <Avatar size="sm" bg="green.500" icon={<FiUser />} ml={2} />
      )}
    </MotionFlex>
  );

  const fetchSuggestedQuestions = useCallback(async () => {
    setLoadingSuggestions(true);
    try {
      const questions = await getSuggestedQuestions(jobPosting.id);
      setSuggestedQuestions(questions.slice(0, 3));
    } catch (error) {
      console.error('Error fetching suggested questions:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  }, [jobPosting.id]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !chatSessionId) return;
    setIsSending(true);
    const userMessage = { role: 'user' as const, content: inputMessage };
    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      setIsTyping(true);
      const answer = await sendChatMessage(jobPosting.id, chatSessionId, inputMessage);
      setChatMessages(prev => [...prev, { role: 'assistant', content: answer }]);
      setIsTyping(false);

      // Generate new suggested questions after each user message
      setLoadingSuggestions(true);
      const chatHistory = [...chatMessages, userMessage, { role: 'assistant', content: answer }]
        .map(msg => `${msg.role}: ${msg.content}`);
      const newQuestions = await generateSuggestedQuestions(jobPosting.id, chatHistory);
      setSuggestedQuestions(newQuestions.slice(0, 3));
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
      setLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    const initializeChat = async () => {
      setIsInitializing(true);
      try {
        const sessionId = await createChatSession(jobPosting.id);
        setChatSessionId(sessionId);
        const history = await getChatHistory(jobPosting.id, sessionId);
        setChatMessages(history);

        // Fetch initial suggested questions
        await fetchSuggestedQuestions();
      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeChat();
  }, [jobPosting.id, fetchSuggestedQuestions]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
    handleSendMessage();
  };

  return (
    <MotionBox
      bg={bgColor}
      p={6}
      borderRadius="lg"
      boxShadow="lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      height="80vh"
      display="flex"
      flexDirection="column"
    >
      <Heading as="h2" size="lg" mb={4}>AI Assistant</Heading>
      {isInitializing ? (
        <Flex justify="center" align="center" height="100%">
          <Spinner size="xl" color="blue.500" thickness="4px" speed="0.65s" />
        </Flex>
      ) : (
        <>
          <Box flex={1} overflowY="auto" borderWidth={1} borderRadius="md" p={4} mb={4} ref={chatContainerRef}>
            <AnimatePresence>
              {chatMessages.map((message, index) => (
                <React.Fragment key={index}>
                  {renderMessage(message)}
                </React.Fragment>
              ))}
            </AnimatePresence>
            {isTyping && (
              <MotionFlex
                justify="flex-start"
                align="center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Avatar size="sm" bg="blue.500" icon={<FiMessageCircle />} mr={2} />
                <MotionBox
                  bg="gray.100"
                  py={2}
                  px={4}
                  borderRadius="lg"
                  animation={`${pulseAnimation} 1.5s infinite`}
                >
                  <Text>AI is typing...</Text>
                </MotionBox>
              </MotionFlex>
            )}
          </Box>
          <Divider mb={4} />
          <VStack spacing={4}>
          <HStack width="100%">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about the job..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isSending || !chatSessionId}
            />
            <Button
              onClick={handleSendMessage}
              colorScheme="blue"
              leftIcon={<FiSend />}
              isLoading={isSending}
              loadingText="Sending"
              disabled={!chatSessionId}
            >
              Send
            </Button>
          </HStack>
          <Box width="100%">
            <Flex justify="space-between" align="center" mb={2}>
              <Heading as="h3" size="sm">Suggested Questions</Heading>
              <Button size="sm" onClick={fetchSuggestedQuestions} leftIcon={<FiRefreshCw />}>
                Refresh
              </Button>
            </Flex>
            <List spacing={2}>
              <AnimatePresence>
                {loadingSuggestions ? (
                  <>
                    <PulsingSkeleton />
                    <PulsingSkeleton />
                    <PulsingSkeleton />
                  </>
                ) : (
                  suggestedQuestions.map((question, index) => (
                    <MotionBox
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ListItem
                        cursor="pointer"
                        onClick={() => handleSuggestedQuestion(question)}
                        _hover={{ bg: 'blue.50', borderRadius: 'md' }}
                        p={2}
                      >
                        <Tooltip label="Click to ask this question" placement="top">
                          <HStack spacing={2}>
                            <Icon as={FiHelpCircle} color="blue.500" />
                            <Text fontSize="sm">{question}</Text>
                          </HStack>
                        </Tooltip>
                      </ListItem>
                    </MotionBox>
                  ))
                )}
              </AnimatePresence>
            </List>
          </Box>
        </VStack>
        </>
      )}
    </MotionBox>
  );
};

export default ChatComponent;