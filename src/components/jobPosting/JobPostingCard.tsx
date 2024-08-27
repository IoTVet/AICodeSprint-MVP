import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { JobPosting } from "../../api/types";
import { FiCalendar, FiEdit2, FiTrash2, FiBriefcase, FiMapPin, FiUsers, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const Card = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
`;

const CardContent = styled.div`
  padding: 2rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const JobTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const JobInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #718096;

  svg {
    margin-right: 0.5rem;
  }
`;

const JobDescription = styled.p`
  font-size: 1rem;
  color: #4a5568;
  line-height: 1.5;
  margin-bottom: 1.5rem;
`;

const ExpandedContent = styled(motion.div)`
  margin-top: 1.5rem;
`;

const ApplicantCount = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 1rem;

  svg {
    margin-right: 0.5rem;
    color: #4299e1;
  }
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const SkillTag = styled.span`
  background-color: #ebf8ff;
  color: #3182ce;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
`;

const CardFooter = styled.div`
  background-color: #f7fafc;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ViewDetailsButton = styled(motion.button)`
  background-color: #4299e1;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #3182ce;
  }
`;

const ExpandButton = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  color: #718096;
`;

interface JobPostingCardProps {
  jobPosting: JobPosting;
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const JobPostingCard: React.FC<JobPostingCardProps> = ({
  jobPosting,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const truncateDescription = (text: string, maxWords: number) => {
    const words = text.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
  };

  return (
    <Card layout>
      <CardContent>
        <CardHeader>
          <JobTitle>{jobPosting.title}</JobTitle>
          <ActionButtons>
            <IconButton whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onEdit}>
              <FiEdit2 size={20} color="#4299e1" />
            </IconButton>
            <IconButton whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onDelete}>
              <FiTrash2 size={20} color="#f56565" />
            </IconButton>
          </ActionButtons>
        </CardHeader>

        <JobInfo>
          <InfoItem>
            <FiBriefcase />
            {jobPosting.company.name}
          </InfoItem>
          <InfoItem>
            <FiMapPin />
            {jobPosting.company.location || 'Remote'}
          </InfoItem>
          <InfoItem>
            <FiCalendar />
            {format(new Date(jobPosting.created_at), 'MMM d, yyyy')}
          </InfoItem>
        </JobInfo>

        <JobDescription>
          {isExpanded ? jobPosting.description : truncateDescription(jobPosting.description, 30)}
        </JobDescription>

        <AnimatePresence>
          {isExpanded && (
            <ExpandedContent
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ApplicantCount>
                <FiUsers />
                23 applicants
              </ApplicantCount>

              <SkillTags>
                {['React', 'TypeScript', 'Node.js'].map((skill, index) => (
                  <SkillTag key={index}>{skill}</SkillTag>
                ))}
              </SkillTags>
            </ExpandedContent>
          )}
        </AnimatePresence>
      </CardContent>

      <CardFooter>
        <ViewDetailsButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewDetails}
        >
          View Details
        </ViewDetailsButton>
        <ExpandButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
        </ExpandButton>
      </CardFooter>
    </Card>
  );
};

export default JobPostingCard;