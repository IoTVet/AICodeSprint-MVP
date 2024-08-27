import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { jobPostingService } from '../../api/services/jobPostingService';
import {XCircleIcon} from "@heroicons/react/24/solid";
import LoadingAnimation from '../common/LoadingAnimation';
import MiniLoadingAnimation from '../common/MiniLoadingAnimation';

interface QuickStatsModalProps {
  jobId: number;
  onClose: () => void;
}

const QuickStatsModal: React.FC<QuickStatsModalProps> = ({ jobId, onClose }) => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        //const response = await jobPostingService.getQuickStats(jobId);
        //setStats(response.data);

      } catch (error) {
        console.error('Error fetching quick stats:', error);
      }
    };

    fetchStats();
  }, [jobId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Quick Stats</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>
        {stats ? (
          <div>
            <p>Total Applicants: {stats.totalApplicants}</p>
            <p>Average Score: {stats.averageScore.toFixed(2)}</p>
            <p>Days Remaining: {stats.daysRemaining}</p>
            {/* Add more stats as needed */}
          </div>
        ) : (
          <MiniLoadingAnimation />
        )}
      </div>
    </motion.div>
  );
};

export default QuickStatsModal;