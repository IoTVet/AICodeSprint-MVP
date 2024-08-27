// src/api/types.ts

export interface JobPosting {
  id: number;
  company: Company;
  title: string;
  description: string;
  ijd_info: IJDInfo;
  created_at: string;
  deadline: string;
  status: string;
  salary_range?: string;
  location?: string;
  total_applicants?: number;
  context_notes: ContextNote[];
}

export interface IJDInfo {
  jobOverview: string[];
  aboutTheOrg: string[];
  jobRequirements: string[];
  jobResponsibilities: string[];
  compensation: string[];
  companyName?: string;
  jobTitle?: string;
}

export interface ContextNote {
  id: number;
  category: string;
  content: string;
  item_index: number;
  created_at: string;
  updated_at: string;
  job_posting: number;
}

export interface Company {
  id: number;
  name: string;
  industry: string | null;
  company_size: string | null;
  logo_url: string | null;
  description?: string;
  location?: string;
}

export interface RubricVersion {
  id: number;
  version: number;
  createdAt: string;
  createdBy: string;
  changes: string[];
  content: RubricContent;
}

export interface Rubric {
  id: number;
  job_posting: number;
  content: RubricContent;
  human_approved: boolean;
  created_at: string;
  approved_by: number | null;
  approved_at: string | null;
}

export interface RubricContent {
  title: string;
  description: string;
  categories: Category[];
}

export interface Category {
  name: string;
  weight: number;
  scoring_levels: ScoringLevel[];
}

export interface ScoringLevel {
  level: number;
  score: number;
  description: string;
}

export interface Rubric {
  id: number;
  job_posting: number;
  content: RubricContent;
  human_approved: boolean;
  created_at: string;
  approved_by: number | null;
  approved_at: string | null;
}

export interface Applicant {
  id: number;
  job_posting: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  resume: Resume;
  applied_at: string;
  status: 'applied' | 'evaluated' | 'review' | 'interview' | 'offer' | 'hired' | 'rejected' | 'withdrawn';
  evaluation: Evaluation;
  current_position?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  notes?: ApplicantNote[];
}

export interface ApplicantNote {
  id: number;
  applicant: number;
  author: number;
  content: string;
  created_at: string;
}

export interface Resume {
  id: number;
  full_text: string;
  parsed_info: ParsedResumeInfo;
  file: string; // URL to the file
}


export enum EducationLevel {
  HIGHSCHOOL = 'HIGH_SCHOOL',
  ASSOCIATE = 'ASSOCIATE',
  BACHELOR = 'BACHELOR',
  MASTER = 'MASTER',
  DOCTORATE = 'DOCTORATE',
  OTHER = 'OTHER'
}

export interface Experience {
  title: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string;
  description: string[];
}
export interface ParsedResumeInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: Experience[];
  education_level: EducationLevel;
  education?: Education[];
  certifications?: string[];
  languages?: string[];
  projects?: Project[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface Education {
  degree: string;
  institution: string;
  location?: string;
  start_date: string;
  end_date?: string;
  gpa?: number;
}

export interface Evaluation {
  id: number;
  content: EvaluationContent; // Consider defining a more specific type if possible
  overall_score: number;
  created_at: string;
  human_approved: boolean;
  approved_by: number | null;
  approved_at: string | null;
}

export interface EvaluationContent {
  evaluations: CategoryEvaluation[];
  overall_assessment: string;
}

export interface CategoryEvaluation {
  category: string;
  score: number;
  justification: string;
}

export interface ContextNote {
  id: number;
  job_posting: number;
  category: string;
  content: string;
  created_at: string;
  updated_at: string;
}




export interface Critique {
  id: number;
  evaluation: Evaluation;
  content: any; // Consider defining a more specific type if possible
  revision_status: 'PASS' | 'MINOR_REVISION' | 'MAJOR_REVISION';
  created_at: string;
  human_approved: boolean;
  approved_by: number | null;
  approved_at: string | null;
}

export interface DashboardStats {
  totalApplicants: number;
  openPositions: number;
  interviewRate: number;
  newMessages: number;
}

export interface RecruitmentActivityData {
  labels: string[];
  applications: number[];
  interviews: number[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Additional types based on backend models

export interface CompanyContext {
  id: number;
  company: number;
  content: string;
  category: string;
  last_updated: string;
}

export interface IJDAIAssistant {
  id: number;
  job: number;
  assistant_instructions: string | null;
}

export interface JobDetail {
  id: number;
  job: number;
  type: string;
  content: string;
}

export interface FAQ {
  id: number;
  job: number;
  question: string;
  answer: string;
}

export interface UserQuestion {
  id: number;
  user: number;
  job: number;
  question_text: string;
  timestamp: string;
}

export interface IJDSuggestedQuestion {
  id: number;
  job: number;
  category: string;
  question_text: string;
}

export interface AIResponse {
  id: number;
  user: number | null;
  message: number | null;
  assistant: number | null;
  response_text: string;
  timestamp: string;
}

export interface Image {
  id: number;
  job: number;
  image_type: string;
  image_url: string;
  description: string | null;
}

export interface IJDCategory {
  COMPANY_NAME: 'companyName';
  JOB_OVERVIEW: 'jobOverview';
  ABOUT_ORG: 'aboutTheOrg';
  JOB_REQUIREMENTS: 'jobRequirements';
  JOB_RESPONSIBILITIES: 'jobResponsibilities';
  COMPENSATION: 'compensation';
}

export interface FloatingActionButtonProps {
  onUploadResume: () => void;
  onViewAnalytics: () => void;
  onEditRubric: () => void;
  onManageSettings: () => void;
}