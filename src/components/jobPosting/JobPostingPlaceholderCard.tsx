import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FiCpu } from 'react-icons/fi';
import { Card } from '../common/Card';

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const PlaceholderCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border: 2px dashed ${({ theme }) => theme.colors.primary};
  padding: 1rem;
`;

const PlaceholderContent = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const AIIcon = styled(motion.div)`
  margin-right: 1rem;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
`;

const PlaceholderText = styled.div`
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

const ProcessingText = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 10px;
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border-radius: 5px;
  overflow: hidden;
`;

const ProgressBarFill = styled(motion.div)`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const stages = [
  "Analyzing job description",
  "Extracting key requirements",
  "Generating rubric",
  "Creating AI assistant",
  "Finalizing job posting"
];

interface JobPostingPlaceholderCardProps {
  title: string;
  duration: number;
  onComplete: () => void;
  onStatusChange: (status: string) => void;
}

export const JobPostingPlaceholderCard: React.FC<JobPostingPlaceholderCardProps> = ({ title, duration, onComplete, onStatusChange }) => {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const totalDuration = duration;
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setIsCompleted(true);
          onComplete();
          return 100;
        }
        return prevProgress + 100 / (totalDuration / 100); // Increment every 100ms
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const newStage = Math.min(Math.floor((progress / 100) * stages.length), stages.length - 1);
    if (newStage !== currentStage) {
      setCurrentStage(newStage);
      onStatusChange(stages[newStage]);
    }
  }, [progress, currentStage, onStatusChange]);

  return (
    <PlaceholderCard>
      <PlaceholderContent>
        <AIIcon
          animate={{
            rotate: [0, 360],
            transition: { duration: 2, repeat: Infinity, ease: "linear" }
          }}
        >
          <FiCpu />
        </AIIcon>
        <PlaceholderText>
          <ProcessingText>{stages[currentStage]}:</ProcessingText> {title}
        </PlaceholderText>
      </PlaceholderContent>
      <ProgressBarContainer>
        <ProgressBarFill
          initial={{ width: 0 }}
          animate={{ width: `${isCompleted ? 100 : progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </ProgressBarContainer>
    </PlaceholderCard>
  );
};