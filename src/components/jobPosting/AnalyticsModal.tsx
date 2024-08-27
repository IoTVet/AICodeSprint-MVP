import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Applicant, JobPosting } from "../../api/types";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { jobPostingService } from '../../api/services/jobPostingService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsModalProps {
  jobPosting: JobPosting;
  applicants: Applicant[];
  onClose: () => void;
}

interface AnalyticsData {
  applicants_over_time: {
    week: string;
    count: number;
  }[];
  applicant_scores: {
    id: number;
    first_name: string;
    last_name: string;
    overall_score: number;
  }[];
  applicant_statuses: {
    status: string;
    count: number;
  }[];
}

const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ jobPosting, applicants, onClose }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await jobPostingService.getAnalytics(jobPosting.id);
        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, [jobPosting.id]);

  const applicantsOverTime = {
    labels: analyticsData?.applicants_over_time.map(item => item.week) || [],
    datasets: [
      {
        label: 'Applicants',
        data: analyticsData?.applicants_over_time.map(item => item.count) || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const applicantScores = {
    labels: analyticsData?.applicant_scores.map(a => `${a.first_name} ${a.last_name}`) || [],
    datasets: [
      {
        label: 'Overall Score',
        data: analyticsData?.applicant_scores.map(a => a.overall_score * 100) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  const applicantStatuses = {
    labels: analyticsData?.applicant_statuses.map(status => status.status) || [],
    datasets: [
      {
        data: analyticsData?.applicant_statuses.map(status => status.count) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      },
    ],
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Analytics for {jobPosting.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Applicants Over Time</h3>
              <Line data={applicantsOverTime} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Applicant Scores</h3>
              <Bar data={applicantScores} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Applicant Statuses</h3>
              <Pie data={applicantStatuses} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Key Metrics</h3>
              <ul className="space-y-2">
                <li><strong>Total Applicants:</strong> {applicants.length}</li>
                <li><strong>Average Score:</strong> {(analyticsData?.applicant_scores.reduce((sum, a) => sum + a.overall_score, 0) || 0 / (analyticsData?.applicant_scores.length || 1) * 100).toFixed(2)}%</li>
                {/* Add more metrics as needed */}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsModal;