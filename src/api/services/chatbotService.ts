// src/api/services/chatbotService.ts

import client from '../client';


export const getSuggestedQuestions = async (jobPostingId: number): Promise<string[]> => {
  try {
    const response = await client.get(`/api/employer/suggested-questions/${jobPostingId}/get_questions/`);
    return response.data.suggested_questions;
  } catch (error) {
    console.error('Error fetching suggested questions:', error);
    throw error;
  }
};

export const generateSuggestedQuestions = async (jobPostingId: number, chatHistory: string[]): Promise<string[]> => {
  try {
    const response = await client.post(`/api/employer/suggested-questions/${jobPostingId}/generate_questions/`, {
      chat_history: chatHistory.join('\n')
    });
    return response.data.suggested_questions;
  } catch (error) {
    console.error('Error generating suggested questions:', error);
    throw error;
  }
};

export const getAnswer = async (jobPostingId: number, question: string): Promise<string> => {
  try {
    const response = await client.post(`api/employer/public/public-job-postings/${jobPostingId}/answer-question/`, { question });
    return response.data.answer;
  } catch (error) {
    console.error('Error getting answer:', error);
    throw error;
  }
};

export const createChatSession = async (jobPostingId: number): Promise<string> => {
  try {
    const response = await client.post(`api/employer/public/public-job-postings/${jobPostingId}/chat-session/`);
    return response.data.session_id;
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
};

export const sendChatMessage = async (jobPostingId: number, sessionId: string, message: string): Promise<string> => {
  try {
    const response = await client.post(`api/employer/public/public-job-postings/${jobPostingId}/chat-session/${sessionId}/`, { message });
    return response.data.answer;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

export const getChatHistory = async (jobPostingId: number, sessionId: string): Promise<Array<{ role: 'user' | 'assistant', content: string }>> => {
  try {
    const response = await client.get(`api/employer/public/public-job-postings/${jobPostingId}/chat-session/${sessionId}/`);
    return response.data.messages;
  } catch (error) {
    console.error('Error getting chat history:', error);
    throw error;
  }
};