export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export interface SurveyQuestion {
  id: string;
  type: 'text' | 'single' | 'multiple';
  question: string;
  options: string[];
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  responses: number;
  status: 'draft' | 'active' | 'closed';
  createdAt: string;
  lastModified: string;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: Record<string, string | string[]>;
  submittedAt: string;
  respondentId?: string;
}

export interface SurveyAnalyticsData {
  totalResponses: number;
  questionAnalytics: Array<{
    questionId: string;
    question: string;
    type: string;
    responses: Array<{
      answer: string | string[];
      count: number;
    }>;
  }>;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}
export enum SurveyStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export interface GeneratedLink {
  id: string;
  surveyId: string;
  surveyTitle: string;
  link: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  responses: number;
  status: SurveyStatus;
}

export interface PublicSurveyProps {
  surveyId: string;
  sessionId?: string;
}

export interface ToastProps {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

export interface CurrentQuestion {
  type: 'text' | 'single' | 'multiple';
  question: string;
  options: string[];
}