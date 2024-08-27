import client from '../client';
import {
  AIResponse,
  Applicant,
  ApplicantNote,
  Company,
  CompanyContext,
  ContextNote,
  Critique,
  DashboardStats,
  Evaluation,
  FAQ,
  IJDAIAssistant,
  IJDSuggestedQuestion,
  Image,
  JobDetail,
  JobPosting,
  PaginatedResponse,
  ParsedResumeInfo,
  Project,
  RecruitmentActivityData,
  Resume,
  Rubric,
  RubricVersion,
  UserQuestion
} from '../types';
import {AxiosResponse} from "axios";
import formClient from "./formClient";

export const jobPostingService = {
  getAll: (params: { page: number; search?: string; ordering?: string }) =>
    client.get<PaginatedResponse<JobPosting>>('/api/employer/job-postings/', { params }),
  getById: (id: number) => client.get<JobPosting>(`/api/employer/job-postings/${id}/`),
  create: async (file: FormData) => { await formClient.post<JobPosting>('/api/employer/job-postings/', file);},
  update: (id: number, data: Partial<JobPosting>) => client.put<JobPosting>(`/api/employer/job-postings/${id}/`, data),
  delete: (id: number) => client.delete(`/api/employer/job-postings/${id}/`),
  getRubric: (id: number) => client.get<Rubric>(`/api/employer/job-postings/${id}/rubric/`),
  approveRubric: (id: number) => client.post(`/api/employer/job-postings/${id}/approve_rubric/`),
  close: (id: number) => client.post(`/api/employer/job-postings/${id}/close/`),
  extendDeadline: (id: number, newDeadline: string) => client.post(`/api/employer/job-postings/${id}/extend_deadline/`, { new_deadline: newDeadline }),
  getDashboardStats: () => client.get<DashboardStats>('/api/employer/dashboard/stats/'),
  getRecruitmentActivityData: () => client.get<RecruitmentActivityData>('/api/employer/dashboard/recruitment-activity/'),
  getAnalytics: (id: number) => client.get<any>(`/api/employer/analytics/${id}/`),
  getPublicJobDetails: (id: number): Promise<AxiosResponse<JobPosting>> =>
    client.get<JobPosting>(`/api/employer/public/public-job-postings/${id}`),
  evaluateCandidate: (id: number, data: FormData) => formClient.post<Applicant>(`/api/employer/job-postings/${id}/evaluate_candidate/`, data),
};



export const applicantService = {
  getAll: (jobId: number, params: { page: number; search?: string; ordering?: string }): Promise<AxiosResponse<PaginatedResponse<Applicant>>> =>
    client.get<PaginatedResponse<Applicant>>(`/api/employer/applicants/`, { params: { ...params, job_posting: jobId } }),
  getById: (id: number) => client.get<Applicant>(`/api/employer/applicants/${id}/`),
  create: (data: Partial<Applicant>) => client.post<Applicant>(`/api/employer/applicants/`, data),
  update: (id: number, data: Partial<Applicant>) => client.put<Applicant>(`/api/employer/applicants/${id}/`, data),
  delete: (id: number) => client.delete(`/api/employer/applicants/${id}/`),
  evaluate: (id: number) => client.post<Evaluation>(`/api/employer/applicants/${id}/evaluate/`),
  submitText: (data: { job_posting: number; content: string; student_name: string }) =>
    client.post<Applicant>('/api/employer/applicants/submit_text/', data),
  uploadResume: (formData: FormData) => formClient.post<Applicant>('/api/employer/applicants/upload_resume/', formData),
};

export const evaluationService = {
  getAll: (params: { page: number; search?: string; ordering?: string }) =>
    client.get<PaginatedResponse<Evaluation>>('/api/employer/evaluations/', { params }),
  getById: (id: number) => client.get<Evaluation>(`/api/employer/evaluations/${id}/`),
  update: (id: number, data: Partial<Evaluation>) => client.put<Evaluation>(`/api/employer/evaluations/${id}/`, data),
  delete: (id: number) => client.delete(`/api/employer/evaluations/${id}/`),
  approve: (id: number) => client.post(`/api/employer/evaluations/${id}/approve/`),
};

export const critiqueService = {
  getAll: (params: { page: number; search?: string; ordering?: string }) =>
    client.get<PaginatedResponse<Critique>>('/api/employer/critiques/', { params }),
  getById: (id: number) => client.get<Critique>(`/api/employer/critiques/${id}/`),
  create: (data: Partial<Critique>) => client.post<Critique>('/api/employer/critiques/', data),
  update: (id: number, data: Partial<Critique>) => client.put<Critique>(`/api/employer/critiques/${id}/`, data),
  delete: (id: number) => client.delete(`/api/employer/critiques/${id}/`),
  approve: (id: number) => client.post(`/api/employer/critiques/${id}/approve/`),
};

export const rubricService = {
  getAll: (params: { page: number; search?: string; ordering?: string }) =>
    client.get<PaginatedResponse<Rubric>>('/api/employer/rubrics/', { params }),
  getAllByJobPosting: (jobPostingId: number, params: { page: number; search?: string; ordering?: string }) =>
    client.get<PaginatedResponse<Rubric>>('/api/employer/rubrics/', {
      params: { ...params, job_posting_id: jobPostingId }
    }),
  getRubricHistory: (jobPostingId: number) =>
    client.get<RubricVersion[]>(`/api/employer/rubrics/history/`, { params: { job_posting_id: jobPostingId } }),
  getById: (id: number) => client.get<Rubric>(`/api/employer/rubrics/${id}/`),
  getByJobPostingId: (jobPostingId: number) =>
    client.get<Rubric>(`/api/employer/job-postings/${jobPostingId}/rubric/`, { params: { job_posting_id: jobPostingId } }),
  create: (data: Partial<Rubric>) => client.post<Rubric>('/api/employer/rubrics/', data),
  update: (rubric: Rubric) => client.put<Rubric>(`/api/employer/rubrics/${rubric.id}/`, rubric),
  delete: (id: number) => client.delete(`/api/employer/rubrics/${id}/`),
  approve: (id: number) => client.post(`/api/employer/rubrics/${id}/approve/`),
};

export const userQuestionService = {
  getAll: () => client.get<UserQuestion[]>('/api/employer/user-questions/'),
  create: (data: Partial<UserQuestion>) => client.post<UserQuestion>('/api/employer/user-questions/', data),
  update: (id: number, data: Partial<UserQuestion>) => client.put<UserQuestion>(`/api/employer/user-questions/${id}/`, data),
  delete: (id: number) => client.delete(`/api/employer/user-questions/${id}/`),
};

export const ijdSuggestedQuestionService = {
  getAll: () => client.get<IJDSuggestedQuestion[]>('/api/employer/ijd-suggested-questions/'),
};

export const aiResponseService = {
  getAll: () => client.get<AIResponse[]>('/api/employer/ai-responses/'),
  generateResponse: (data: { question: string; job_id: number }) =>
    client.post<AIResponse>('/api/employer/ai-responses/generate_response/', data),
};

export const resumeService = {
  getById: (id: number) => client.get<Resume>(`/api/employer/resumes/${id}/`),
  create: (data: FormData) => formClient.post<Resume>('/api/employer/resumes/', data),
  update: (id: number, data: Partial<Resume>) => client.put<Resume>(`/api/employer/resumes/${id}/`, data),
  delete: (id: number) => client.delete(`/api/employer/resumes/${id}/`),
};

export const parsedResumeInfoService = {
  getById: (id: number) => client.get<ParsedResumeInfo>(`/api/employer/parsed-resume-info/${id}/`),
  update: (id: number, data: Partial<ParsedResumeInfo>) => client.put<ParsedResumeInfo>(`/api/employer/parsed-resume-info/${id}/`, data),
};

export const projectService = {
  getAll: () => client.get<Project[]>('/api/employer/projects/'),
  getById: (id: number) => client.get<Project>(`/api/employer/projects/${id}/`),
  create: (data: Partial<Project>) => client.post<Project>('/api/employer/projects/', data),
  update: (id: number, data: Partial<Project>) => client.put<Project>(`/api/employer/projects/${id}/`, data),
  delete: (id: number) => client.delete(`/api/employer/projects/${id}/`),
};

export const applicantNoteService = {
  getAll: (applicantId: number) => client.get<ApplicantNote[]>(`/api/employer/applicant-notes/`, { params: { applicant: applicantId } }),
  create: (data: Partial<ApplicantNote>) => client.post<ApplicantNote>('/api/employer/applicant-notes/', data),
  update: (id: number, data: Partial<ApplicantNote>) => client.put<ApplicantNote>(`/api/employer/applicant-notes/${id}/`, data),
  delete: (id: number) => client.delete(`/api/employer/applicant-notes/${id}/`),
};

export const companyService = {
  getAll: () => client.get<Company[]>('/api/employer/companies/'),
  getById: (id: number) => client.get<Company>(`/api/employer/companies/${id}/`),
  create: (data: Partial<Company>) => client.post<Company>('/api/employer/companies/', data),
  update: (id: number, data: Partial<Company>) => client.put<Company>(`/api/employer/companies/${id}/`, data),
  delete: (id: number) => client.delete(`/api/employer/companies/${id}/`),
};

export const companyContextService = {
  getAll: (companyId: number) => client.get<CompanyContext[]>(`/api/employer/company-contexts/`, { params: { company: companyId } }),
  create: (data: Partial<CompanyContext>) => client.post<CompanyContext>('/api/employer/company-contexts/', data),
  update: (id: number, data: Partial<CompanyContext>) => client.put<CompanyContext>(`/api/employer/company-contexts/${id}/`, data),
  delete: (id: number) => client.delete(`/api/employer/company-contexts/${id}/`),
};

export const contextNoteService = {
  getAll: (jobPostingId: number): Promise<AxiosResponse<PaginatedResponse<ContextNote>>> =>
    client.get<PaginatedResponse<ContextNote>>(`/api/employer/context-notes/?job_posting=${jobPostingId}`),

  create: (data: Partial<ContextNote>): Promise<AxiosResponse<ContextNote>> =>
    client.post<ContextNote>('/api/employer/context-notes/', data),

  update: (id: number, data: Partial<ContextNote>): Promise<AxiosResponse<ContextNote>> =>
    client.put<ContextNote>(`/api/employer/context-notes/${id}/`, data),

  delete: (id: number): Promise<AxiosResponse<void>> =>
    client.delete(`/api/employer/context-notes/${id}/`),

  getCategories: (): Promise<AxiosResponse<string[]>> =>
    client.get<string[]>('/api/employer/context-notes/categories/'),
};

export const ijdAIAssistantService = {
  getAll: () => client.get<IJDAIAssistant[]>('/api/employer/ijd-ai-assistants/'),
  getById: (id: number) => client.get<IJDAIAssistant>(`/api/employer/ijd-ai-assistants/${id}/`),
  create: (data: Partial<IJDAIAssistant>) => client.post<IJDAIAssistant>('/api/employer/ijd-ai-assistants/', data),
  update: (id: number, data: Partial<IJDAIAssistant>) => client.put<IJDAIAssistant>(`/api/employer/ijd-ai-assistants/${id}/`, data),
  delete: (id: number) => client.delete(`/api/employer/ijd-ai-assistants/${id}/`),
};

export const jobDetailService = {
  getAll: (jobPostingId: number) => client.get<JobDetail[]>(`/api/employer/job-details/`, { params: { job_posting: jobPostingId } }),
  create: (data: Partial<JobDetail>) => client.post<JobDetail>('/api/employer/job-details/', data),
  update: (id: number, data: Partial<JobDetail>) => client.put<JobDetail>(`/api/employer/job-details/${id}/`, data),
  delete: (id: number) => client.delete(`/api/employer/job-details/${id}/`),
};

export const faqService = {
  getAll: (jobPostingId: number) => client.get<FAQ[]>(`/api/employer/faqs/`, { params: { job_posting: jobPostingId } }),
  create: (data: Partial<FAQ>) => client.post<FAQ>('/api/employer/faqs/', data),
  update: (id: number, data: Partial<FAQ>) => client.put<FAQ>(`/api/employer/faqs/${id}/`, data),
  delete: (id: number) => client.delete(`/api/employer/faqs/${id}/`),
};

export const imageService = {
  getAll: (jobPostingId: number) => client.get<Image[]>(`/api/employer/images/`, { params: { job_posting: jobPostingId } }),
  create: (data: FormData) => formClient.post<Image>('/api/employer/images/', data),
  update: (id: number, data: Partial<Image>) => client.put<Image>(`/api/employer/images/${id}/`, data),
  delete: (id: number) => client.delete(`/api/employer/images/${id}/`),
};