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

// New interfaces based on project usage
export interface DateRange {
  startDate: string;
  endDate: string;
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
  status: 'active' | 'inactive';
}

export interface SurveyLinkGeneratorProps {
  surveys: Survey[];
  onBack: () => void;
}

export interface SurveyCreatorProps {
  onSurveyCreated: (survey: Survey) => void;
  onCancel: () => void;
}

export interface AdminLoginProps {
  onLogin: (userData: User) => void;
}

export interface PublicSurveyProps {
  surveyId: string;
  sessionId?: string;
}

// Remove the generic ComponentProps and keep other interfaces unchanged
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