export interface ResumeProfile {
  fullName: string;
  email: string;
  phone?: string;
  targetRole: string;
  experienceLevel: string;
  preferredLocation: string;
  workplaceType: 'Remote' | 'Hybrid' | 'On-site' | 'Any';
  expectedSalary?: string;
  resumeText: string;
  fileName?: string;
  portfolioUrl?: string;
}

export interface MatchedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  workplaceType: 'Remote' | 'Hybrid' | 'On-site';
  employmentType: 'Full-time' | 'Contract' | 'Part-time';
  salary: string;
  matchScore: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
  description: string;
  postedDate: string;
  logoColor?: string;
}

export interface ScoreBreakdown {
  keywordMatch: number;
  impactMetrics: number;
  skillsCoverage: number;
  formattingAts: number;
}

export interface ImprovementTip {
  category: 'Impact & Metrics' | 'Keyword Alignment' | 'Skills Section' | 'Formatting';
  tip: string;
  before?: string;
  after?: string;
}

export interface ResumeAnalysisResult {
  candidateName: string;
  targetRole: string;
  overallScore: number;
  scoreBreakdown: ScoreBreakdown;
  summary: string;
  extractedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  matchedJobs: MatchedJob[];
  improvementTips: ImprovementTip[];
  analyzedAt: string;
  agentStatus: {
    status: number;
    durationMs: number;
    isListeningPrompt: boolean;
    rawResponse?: any;
  };
}
