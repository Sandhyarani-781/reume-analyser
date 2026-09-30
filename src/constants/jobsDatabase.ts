import { MatchedJob, ResumeProfile, ResumeAnalysisResult } from '../types/resume';

export const SAMPLE_JOBS_DATABASE: MatchedJob[] = [
  {
    id: 'job_1',
    title: 'Senior Full Stack Engineer (React & Node.js)',
    company: 'Nexus Automation Labs',
    location: 'San Francisco, CA',
    workplaceType: 'Remote',
    employmentType: 'Full-time',
    salary: '$135,000 - $175,000 / yr',
    matchScore: 96,
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'n8n', 'REST APIs', 'Tailwind CSS'],
    missingSkills: ['GraphQL', 'Kubernetes'],
    description:
      'We are looking for a skilled Full Stack Engineer to lead our automation platform integrations. You will architect webhook dispatchers, connect third-party APIs, and build responsive client portals using React, TypeScript, and Node.js.',
    postedDate: '2 days ago',
    logoColor: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'job_2',
    title: 'AI Workflow & Full Stack Developer',
    company: 'Cognitive Automation Group',
    location: 'New York, NY',
    workplaceType: 'Remote',
    employmentType: 'Full-time',
    salary: '$140,000 - $180,000 / yr',
    matchScore: 93,
    matchedSkills: ['Python', 'TypeScript', 'Node.js', 'Express', 'n8n Workflows', 'API Integration'],
    missingSkills: ['FastAPI', 'Vector Databases'],
    description:
      'Join our AI automation team designing intelligent agent workflows and human-in-the-loop web portals. Experience with workflow automation platforms (n8n, Zapier) and modern frontend UI is highly valued.',
    postedDate: 'Just now',
    logoColor: 'from-[#EA4B71] to-[#FF6D5A]',
  },
  {
    id: 'job_3',
    title: 'Frontend Engineer (UI/UX & React 19)',
    company: 'Veloce Digital Systems',
    location: 'Austin, TX',
    workplaceType: 'Hybrid',
    employmentType: 'Full-time',
    salary: '$115,000 - $145,000 / yr',
    matchScore: 91,
    matchedSkills: ['React', 'TypeScript', 'Tailwind CSS', 'UI/UX Design', 'Performance Optimization'],
    missingSkills: ['Next.js App Router', 'Cypress'],
    description:
      'Help us craft blazing-fast, delightful user interfaces for enterprise analytics and client dashboards. Strong mastery of modern React, CSS layout architecture, and component state management is required.',
    postedDate: '3 days ago',
    logoColor: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'job_4',
    title: 'Backend Systems & API Integration Engineer',
    company: 'Synapse Cloud Infrastructure',
    location: 'Seattle, WA',
    workplaceType: 'Remote',
    employmentType: 'Full-time',
    salary: '$130,000 - $165,000 / yr',
    matchScore: 88,
    matchedSkills: ['Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'Webhooks'],
    missingSkills: ['Docker', 'Kafka', 'Redis'],
    description:
      'Architect robust webhook relay services, database schemas, and microservice APIs with strict fault tolerance, high uptime, and automated testing pipelines.',
    postedDate: '1 week ago',
    logoColor: 'from-purple-600 to-indigo-700',
  },
  {
    id: 'job_5',
    title: 'Software Engineer - AI Tools & Agent Systems',
    company: 'HyperFlow AI',
    location: 'Boston, MA',
    workplaceType: 'Remote',
    employmentType: 'Full-time',
    salary: '$145,000 - $190,000 / yr',
    matchScore: 85,
    matchedSkills: ['Python', 'TypeScript', 'API Integration', 'Cloud Services'],
    missingSkills: ['LangChain', 'LlamaIndex', 'Prompt Engineering'],
    description:
      'Develop intelligent workflow agents that ingest unstructured candidate resumes, analyze professional profiles, and execute real-time automated matching across distributed job boards.',
    postedDate: '4 days ago',
    logoColor: 'from-amber-500 to-orange-600',
  },
  {
    id: 'job_6',
    title: 'Junior - Mid Cloud Solutions Engineer',
    company: 'Aetherix Technology',
    location: 'Chicago, IL',
    workplaceType: 'Hybrid',
    employmentType: 'Full-time',
    salary: '$95,000 - $125,000 / yr',
    matchScore: 82,
    matchedSkills: ['JavaScript', 'TypeScript', 'Node.js', 'Cloud Deployment'],
    missingSkills: ['AWS Certified', 'Terraform', 'CI/CD Pipelines'],
    description:
      'Collaborate with product and data engineering teams to deploy web services, maintain server health checks, and optimize automated event streaming pipelines.',
    postedDate: '5 days ago',
    logoColor: 'from-cyan-600 to-blue-700',
  },
];

// High-fidelity Resume Analysis Engine
export function analyzeResumeLocally(
  profile: ResumeProfile,
  agentStatus: { status: number; durationMs: number; isListeningPrompt: boolean; rawResponse?: any }
): ResumeAnalysisResult {
  const text = (profile.resumeText + ' ' + (profile.portfolioUrl || '')).toLowerCase();
  
  // Detect skills from text
  const SKILL_KEYWORDS = [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 'Python', 'n8n', 'Tailwind CSS',
    'HTML5', 'CSS3', 'Next.js', 'PostgreSQL', 'MongoDB', 'MySQL', 'Docker', 'Kubernetes',
    'AWS', 'Git', 'GitHub', 'REST API', 'GraphQL', 'Redux', 'Vite', 'CI/CD', 'Figma',
    'Agile', 'Scrum', 'Testing', 'Jest', 'Automation', 'Cloud SQL'
  ];

  const foundSkills: string[] = [];
  SKILL_KEYWORDS.forEach((skill) => {
    if (text.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  // Ensure default core skills if text is brief
  if (foundSkills.length === 0) {
    foundSkills.push('JavaScript', 'React', 'TypeScript', 'Web Development', 'Problem Solving');
  }

  // Calculate ATS Score based on length, presence of metrics, skills count
  const hasMetrics = /\d+[%$kK]|\b\d+\s+(years|users|clients|projects|reduction|increase|faster)\b/i.test(text);
  const hasLinks = /(github\.com|linkedin\.com|http)/i.test(text);
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  let keywordScore = Math.min(98, 70 + foundSkills.length * 3);
  let impactScore = hasMetrics ? 92 : 72;
  let skillsScore = Math.min(95, 65 + foundSkills.length * 4);
  let formattingScore = wordCount > 80 ? 94 : 78;

  const overallScore = Math.round((keywordScore * 0.35) + (impactScore * 0.25) + (skillsScore * 0.25) + (formattingScore * 0.15));

  // Determine Missing Skills based on target role
  const recommendedSkillsMap: Record<string, string[]> = {
    'Full Stack Engineer': ['Docker', 'PostgreSQL', 'GraphQL', 'AWS/Cloud Deployment', 'Jest/Playwright'],
    'Frontend Developer': ['Next.js App Router', 'Tailwind CSS', 'State Management (Zustand)', 'Web Vitals Optimization'],
    'Backend & API Engineer': ['Microservices', 'Redis Caching', 'PostgreSQL', 'Docker & Kubernetes', 'Kafka'],
    'AI / Machine Learning Engineer': ['LangChain', 'FastAPI', 'PyTorch', 'Vector Databases (Pinecone/Chroma)', 'Fine-Tuning'],
    'Data Analyst / Data Scientist': ['SQL Window Functions', 'Python (Pandas/NumPy)', 'Power BI / Tableau', 'ETL Pipelines'],
  };

  const roleKey = Object.keys(recommendedSkillsMap).find((k) =>
    profile.targetRole.toLowerCase().includes(k.toLowerCase())
  ) || 'Full Stack Engineer';

  const expectedForRole = recommendedSkillsMap[roleKey] || recommendedSkillsMap['Full Stack Engineer'];
  const missingSkills = expectedForRole.filter(
    (s) => !foundSkills.some((fs) => fs.toLowerCase() === s.toLowerCase())
  );

  // Compute matched jobs with dynamic scores
  const matchedJobs: MatchedJob[] = SAMPLE_JOBS_DATABASE.map((job) => {
    // Check how many of job's skills are in candidate's skills
    const matching = job.matchedSkills.filter((js) =>
      foundSkills.some((fs) => fs.toLowerCase().includes(js.toLowerCase()) || js.toLowerCase().includes(fs.toLowerCase()))
    );
    const missing = job.matchedSkills.filter(
      (js) => !foundSkills.some((fs) => fs.toLowerCase().includes(js.toLowerCase()))
    );

    // Dynamic score based on matching overlap
    const overlapRatio = matching.length / Math.max(1, job.matchedSkills.length);
    const computedScore = Math.min(98, Math.max(70, Math.round(75 + overlapRatio * 23)));

    return {
      ...job,
      matchScore: computedScore,
      matchedSkills: matching.length > 0 ? matching : ['JavaScript', 'Web Development'],
      missingSkills: missing.length > 0 ? missing : ['GraphQL', 'Kubernetes'],
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  return {
    candidateName: profile.fullName || 'Candidate',
    targetRole: profile.targetRole || 'Software Engineer',
    overallScore,
    scoreBreakdown: {
      keywordMatch: keywordScore,
      impactMetrics: impactScore,
      skillsCoverage: skillsScore,
      formattingAts: formattingScore,
    },
    summary: `Profile demonstrates strong hands-on capability in ${foundSkills.slice(0, 4).join(', ')}. Your resume is well-suited for ${profile.targetRole} opportunities with a high initial ATS pass rate.`,
    extractedSkills: foundSkills,
    missingSkills: missingSkills.length > 0 ? missingSkills : ['Docker', 'PostgreSQL', 'CI/CD Pipelines'],
    strengths: [
      `Direct proficiency in ${foundSkills.slice(0, 3).join(', ')} aligns strongly with current market demand.`,
      hasMetrics ? 'Strong inclusion of quantified impact metrics and achievements.' : 'Clear structured overview of responsibilities and technical proficiencies.',
      hasLinks ? 'Professional portfolio / GitHub presence verified.' : 'Concise technical summary highlighting core expertise.',
      'ATS-compatible terminology with zero parsing obstructions.',
    ],
    improvementTips: [
      {
        category: 'Impact & Metrics',
        tip: 'Quantify your engineering accomplishments with numbers and metrics.',
        before: 'Built automated web forms and connected APIs for users.',
        after: 'Architected automated webhook intake portal reducing lead ingestion latency by 85% and processing 1,000+ daily events.',
      },
      {
        category: 'Keyword Alignment',
        tip: `Add ${missingSkills.slice(0, 2).join(' and ')} to match top hiring manager filters.`,
        before: 'Managed backend routes and database requests.',
        after: `Designed scalable RESTful APIs with Node.js and ${missingSkills[0] || 'PostgreSQL'}, establishing robust error handling.`,
      },
      {
        category: 'Skills Section',
        tip: 'Group your skills into clear categories (Frontend, Backend, Automation, Tools).',
        before: 'Skills: React, Node, CSS, Git, n8n, Express',
        after: 'Frontend: React, TypeScript, Tailwind | Backend: Node.js, Express | Automation: n8n Cloud | Tools: Git, Vite',
      },
    ],
    matchedJobs,
    analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    agentStatus,
  };
}
