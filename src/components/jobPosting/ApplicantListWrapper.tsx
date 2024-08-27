// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { jobPostingService, applicantService, rubricService } from '../../api/services/jobPostingService';
// import { JobPosting, Applicant, Rubric, PaginatedResponse } from '../../api/types';
// import ApplicantList from './ApplicantList';
// import { Loader } from '../common/Loader';
// import { AxiosResponse } from 'axios';
// import LoadingAnimation from '../common/LoadingAnimation';
// import MiniLoadingAnimation from '../common/MiniLoadingAnimation';
// import ApplicantsList from './ApplicantList';
//
// const ApplicantListWrapper: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
//   const [applicants, setApplicants] = useState<Applicant[]>([]);
//   const [rubric, setRubric] = useState<Rubric | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
//
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [jobPostingResponse, applicantsResponse, rubricResponse]: [
//         AxiosResponse<JobPosting>,
//         AxiosResponse<PaginatedResponse<Applicant>>,
//         AxiosResponse<PaginatedResponse<Rubric>>
//       ] = await Promise.all([
//         jobPostingService.getById(Number(id)),
//         applicantService.getAll(Number(id), { page: 1 }),
//         rubricService.getAll({ page: 1 })
//       ]);
//
//       setJobPosting(jobPostingResponse.data);
//       setApplicants(applicantsResponse.data.results);
//       setRubric(rubricResponse.data.results[0] || null);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   useEffect(() => {
//     fetchData();
//   }, [id]);
//
//   const handleViewApplicant = (applicant: Applicant) => {
//     setSelectedApplicant(applicant);
//     // You might want to open a modal or navigate to a new page here
//   };
//
//   if (loading || !jobPosting || !rubric) {
//     return <MiniLoadingAnimation />;
//   }
//
//   return (
//     <ApplicantsList
//     jobPosting={jobPosting}
//     applicants={applicants}
//     onViewApplicant={handleViewApplicant}
//   />
//   );
// };
//
export {};