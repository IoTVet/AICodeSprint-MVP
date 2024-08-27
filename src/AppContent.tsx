// AppContent.tsx

import React, {useState, Suspense, useEffect} from 'react';
import {Routes, Route, Navigate, Outlet, useParams} from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useUnauthorizedHandler } from './hooks/useUnauthorizedHandler';
import AppLayout from "./components/layout/AppLayout"
import PublicLayout from './components/layout/PublicLayout';
import PrivateRoute from './components/PrivateRoute';
import { JobPosting } from './api/types';
import LoadingAnimation from './components/common/LoadingAnimation';
import {jobPostingService} from "./api/services/jobPostingService";

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const JobPostings = React.lazy(() => import('./pages/JobPosting').then(module => ({ default: module.default })));
const JobPostingFullView = React.lazy(() => import('./components/jobPosting/JobPostingFullView'));
const Candidates = React.lazy(() => import('./pages/Candidates'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const CompanyContext = React.lazy(() => import('./pages/CompanyContext'));
const PublicJobView = React.lazy(() => import('./pages/PublicJobView'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [selectedJobPosting, setSelectedJobPosting] = useState<JobPosting | null>(null);

  useUnauthorizedHandler();

  const PublicJobViewWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);

  useEffect(() => {
    const fetchJobPosting = async () => {
      try {
        const response = await jobPostingService.getPublicJobDetails(Number(id));
        setJobPosting(response.data);
      } catch (error) {
        console.error('Error fetching job posting:', error);
        // Handle error (e.g., show error message)
      }
    };

    fetchJobPosting();
  }, [id]);

  if (!jobPosting) {
    return <LoadingAnimation />; // Or some other loading indicator
  }

  return <PublicJobView jobPosting={jobPosting} />;
};

  const handleSelectJobPosting = (jobPosting: JobPosting) => {
    setSelectedJobPosting(jobPosting);
  };

  const handleCloseJobPostingFullView = () => {
    setSelectedJobPosting(null);
  };

  return (
    <Suspense fallback={<LoadingAnimation />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout><Outlet /></PublicLayout>}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/job/:id" element={<PublicJobViewWrapper />} />
        </Route>

        {/* Private routes */}
        <Route element={<AppLayout><Outlet /></AppLayout>}>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/job-postings"
            element={
              <PrivateRoute>
                <JobPostings onSelectJobPosting={handleSelectJobPosting} />
              </PrivateRoute>
            }
          />
          <Route
            path="/job-postings/:id"
            element={
              <PrivateRoute>
                {selectedJobPosting ? (
                  <JobPostingFullView
                    jobPosting={selectedJobPosting}
                    onClose={handleCloseJobPostingFullView}
                  />
                ) : (
                  <Navigate to="/job-postings" replace />
                )}
              </PrivateRoute>
            }
          />
          <Route
            path="/company-context"
            element={
              <PrivateRoute>
                <CompanyContext />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <Analytics />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Redirect routes */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppContent;