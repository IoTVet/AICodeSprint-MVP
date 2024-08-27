import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUsers, FiBriefcase, FiTrendingUp, FiMessageSquare } from 'react-icons/fi';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import DataVisualization from '../components/DataVisualization';
import { jobPostingService } from '../api/services/jobPostingService';
import {DashboardStats, RecruitmentActivityData} from '../api/types';
import LoadingAnimation from '../components/common/LoadingAnimation';

const DashboardContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const StatContent = styled.div`
  text-align: right;
`;

const StatValue = styled.h3`
  font-size: 1.5rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.textDark};
`;

const StatLabel = styled.p`
  font-size: 0.875rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ChartContainer = styled(Card)`
  grid-column: 1 / -1;
`;

const ActionButton = styled(Button)`
  margin-top: 1rem;
`;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const Dashboard: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<RecruitmentActivityData | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsResponse = await jobPostingService.getDashboardStats();
      setDashboardStats(statsResponse.data);

      const chartDataResponse = await jobPostingService.getRecruitmentActivityData();
      setChartData(chartDataResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  if (!dashboardStats || !chartData) {
    return <LoadingAnimation />;
  }

  return (
    <DashboardContainer
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <StatCard>
        <StatIcon>
          <FiUsers />
        </StatIcon>
        <StatContent>
          <StatValue>{dashboardStats.totalApplicants}</StatValue>
          <StatLabel>Total Applicants</StatLabel>
        </StatContent>
      </StatCard>
      <StatCard>
        <StatIcon>
          <FiBriefcase />
        </StatIcon>
        <StatContent>
          <StatValue>{dashboardStats.openPositions}</StatValue>
          <StatLabel>Open Positions</StatLabel>
        </StatContent>
      </StatCard>
      <StatCard>
        <StatIcon>
          <FiTrendingUp />
        </StatIcon>
        <StatContent>
          <StatValue>{(dashboardStats.interviewRate * 100).toFixed(1)}%</StatValue>
          <StatLabel>Interview Rate</StatLabel>
        </StatContent>
      </StatCard>
      <StatCard>
        <StatIcon>
          <FiMessageSquare />
        </StatIcon>
        <StatContent>
          <StatValue>{dashboardStats.newMessages}</StatValue>
          <StatLabel>New Messages</StatLabel>
        </StatContent>
      </StatCard>
      <ChartContainer title="Recruitment Activity">
        <DataVisualization
          type="bar"
          data={{
            labels: chartData.labels,
            datasets: [
              {
                label: 'Applications',
                data: chartData.applications,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
              },
              {
                label: 'Interviews',
                data: chartData.interviews,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: 'Recruitment Activity',
              },
            },
          }}
        />
        <ActionButton onClick={() => console.log('View detailed report')}>View Detailed Report</ActionButton>
      </ChartContainer>
    </DashboardContainer>
  );
};

export default Dashboard;