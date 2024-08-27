import React from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, UserGroupIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import {JobPosting} from "../../api/types";

interface JobPostingStatusProps {
  jobPosting: JobPosting;
  onClose: () => void;
  onExtend: () => void;
}

const JobPostingStatus: React.FC<JobPostingStatusProps> = ({ jobPosting, onClose, onExtend }) => {
  const isActive = new Date(jobPosting.deadline) > new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-lg rounded-lg p-6 mb-8"
    >
      <h2 className="text-2xl font-bold mb-4">Job Posting Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center">
          <CalendarIcon className="h-6 w-6 text-indigo-600 mr-2" />
          <span>Posted on: {new Date(jobPosting.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center">
          <ClockIcon className="h-6 w-6 text-indigo-600 mr-2" />
          <span>Deadline: {new Date(jobPosting.deadline).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center">
          <UserGroupIcon className="h-6 w-6 text-indigo-600 mr-2" />
          <span>Total Applicants: {jobPosting.total_applicants !== undefined ? jobPosting.total_applicants : 'N/A'}</span>
        </div>
        <div className="flex items-center">
          {isActive ? (
            <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
          ) : (
            <XCircleIcon className="h-6 w-6 text-red-600 mr-2" />
          )}
          <span>Status: {isActive ? 'Active' : 'Closed'}</span>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        {isActive ? (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Close Job Posting
          </button>
        ) : (
          <button
            onClick={onExtend}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            Extend Deadline
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default JobPostingStatus;