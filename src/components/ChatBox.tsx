import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  VStack,
  Heading,
  Input,
  Button,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiSend } from 'react-icons/fi';
import MiniLoadingAnimation from './common/MiniLoadingAnimation';

interface ChatBoxProps {
  title: string;
  jobPostingId?: number;
}

interface Message {
  sender: 'user' | 'ai';
  message: string;
  displayedMessage: string;
  isComplete: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ title, jobPostingId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  const welcomeMessage = `Welcome! I'm your AI assistant for ${title}. How can I help you today?`;

  useEffect(() => {
    // Add welcome message when component mounts
    setIsAiThinking(true);
    setTimeout(() => {
      setMessages([{ sender: 'ai', message: welcomeMessage, displayedMessage: '', isComplete: false }]);
      setIsAiThinking(false);
    }, 1000);
  }, [title, welcomeMessage]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'ai' && !lastMessage.isComplete) {
      const timer = setTimeout(() => {
        setMessages(prevMessages => 
          prevMessages.map((msg, index) => 
            index === prevMessages.length - 1
              ? {
                  ...msg,
                  displayedMessage: msg.message.slice(0, msg.displayedMessage.length + 1),
                  isComplete: msg.displayedMessage.length + 1 >= msg.message.length
                }
              : msg
          )
        );
      }, 1);

      return () => clearTimeout(timer);
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = useCallback(() => {
    if (currentMessage.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'user', message: currentMessage, displayedMessage: currentMessage, isComplete: true }
      ]);
      setCurrentMessage('');
      setIsAiThinking(true);

      // Simulate AI response
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            sender: 'ai',
            message: "I'm processing your request. How else can I assist you?",
            displayedMessage: '',
            isComplete: false
          }
        ]);
        setIsAiThinking(false);
      }, 1500);
    }
  }, [currentMessage, jobPostingId]);

  return (
    <Box height="100%" width="100%" bg={bgColor} p={4}>
      <VStack height="100%" spacing={4}>
        <Heading size="lg" color={textColor}>{title}</Heading>
        <Box
          flex={1}
          width="100%"
          overflowY="auto"
          borderRadius="md"
          borderWidth={1}
          borderColor={useColorModeValue('gray.200', 'gray.600')}
          p={2}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              bg={msg.sender === 'user' ? 'blue.100' : 'gray.100'}
              color={textColor}
              borderRadius="md"
              p={2}
              mb={2}
              alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
            >
              {msg.sender === 'ai' && (
                <Flex alignItems="center">
                  <Box mr={2} width="50px" height="50px">
                    {msg.isComplete && <MiniLoadingAnimation />}
                  </Box>
                  <Text>{msg.displayedMessage}</Text>
                </Flex>
              )}
              {msg.sender === 'user' && <Text>{msg.message}</Text>}
            </Box>
          ))}
          {isAiThinking && (
            <Box
              bg="gray.100"
              color={textColor}
              borderRadius="md"
              p={2}
              mb={2}
              alignSelf="flex-start"
            >
              <Flex alignItems="center">
                <Box mr={2} width="100px" height="100px">
                  <MiniLoadingAnimation />
                </Box>
              </Flex>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>
        <Flex width="100%">
          <Input
            flex={1}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type your message here..."
            mr={2}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button
            colorScheme="blue"
            onClick={handleSendMessage}
            leftIcon={<FiSend />}
          >
            Send
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default ChatBox;