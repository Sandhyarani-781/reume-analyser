import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { EndpointBar } from './components/EndpointBar';
import { FriendlyHero } from './components/FriendlyHero';
import { PortalForm } from './components/PortalForm';
import { ResumeAnalysisDashboard } from './components/ResumeAnalysisDashboard';
import { FormBuilderModal } from './components/FormBuilderModal';
import { PayloadInspector } from './components/PayloadInspector';
import { SubmissionHistory } from './components/SubmissionHistory';
import { LiveEmbedViewer } from './components/LiveEmbedViewer';
import { WorkflowGuide } from './components/WorkflowGuide';
import { FormField, FormPreset, SubmissionLogItem, EndpointStatus } from './types/n8n';
import { ResumeAnalysisResult, ResumeProfile } from './types/resume';
import { DEFAULT_N8N_TEST_URL, FORM_PRESETS } from './constants/presets';
import { analyzeResumeLocally } from './constants/jobsDatabase';
import { Zap, ExternalLink, Briefcase, Sparkles } from 'lucide-react';

export default function App() {
  // Target URL state
  const [targetUrl, setTargetUrl] = useState<string>(() => {
    return localStorage.getItem('n8n_target_url') || DEFAULT_N8N_TEST_URL;
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'portal' | 'results' | 'inspector' | 'history' | 'preview' | 'guide'>('portal');

  // Friendly mode vs Developer mode
  const [isDevMode, setIsDevMode] = useState<boolean>(() => {
    return localStorage.getItem('n8n_dev_mode') === 'true';
  });

  // Active preset ID (defaults to resume-analyser)
  const [currentPresetId, setCurrentPresetId] = useState<string>(() => {
    return localStorage.getItem('n8n_preset_id') || FORM_PRESETS[0].id;
  });

  // Fields and schema
  const [fields, setFields] = useState<FormField[]>(() => {
    const saved = localStorage.getItem('n8n_form_fields');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall back
      }
    }
    return FORM_PRESETS[0].fields;
  });

  const [formTitle, setFormTitle] = useState<string>(() => {
    return localStorage.getItem('n8n_form_title') || FORM_PRESETS[0].title;
  });

  // Form values
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach((f) => {
      initial[f.name] = f.defaultValue ?? '';
    });
    return initial;
  });

  // Resume Analysis Result
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(() => {
    const saved = localStorage.getItem('n8n_analysis_result');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall back
      }
    }
    // Generate an initial default analysis so the user can see matching jobs immediately
    const defaultProfile: ResumeProfile = {
      fullName: 'Sandhya Rani',
      email: 'sandhyarani@example.com',
      targetRole: 'Full Stack Engineer',
      experienceLevel: '3 - 5 Years (Mid-level)',
      preferredLocation: 'Remote',
      workplaceType: 'Remote',
      resumeText:
        'Experienced Full Stack Software Engineer skilled in React, TypeScript, Node.js, Express, Python, n8n workflows, Tailwind CSS, REST APIs, and PostgreSQL. Built scalable web portals, automated webhook pipelines, and responsive frontend applications.',
      portfolioUrl: 'https://github.com/Sandhyarani-781',
    };
    return analyzeResumeLocally(defaultProfile, {
      status: 200,
      durationMs: 780,
      isListeningPrompt: false,
    });
  });

  // Submission history
  const [history, setHistory] = useState<SubmissionLogItem[]>(() => {
    const saved = localStorage.getItem('n8n_submission_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall back
      }
    }
    return [];
  });

  // Builder Modal
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  // Status of the endpoint
  const [endpointStatus, setEndpointStatus] = useState<EndpointStatus>({
    status: null,
    statusText: null,
    durationMs: null,
    isListeningPrompt: false,
    isReady: false,
    title: null,
    lastChecked: null,
    checking: false,
  });

  // Persist settings
  useEffect(() => {
    localStorage.setItem('n8n_target_url', targetUrl);
  }, [targetUrl]);

  useEffect(() => {
    localStorage.setItem('n8n_form_fields', JSON.stringify(fields));
  }, [fields]);

  useEffect(() => {
    localStorage.setItem('n8n_form_title', formTitle);
  }, [formTitle]);

  useEffect(() => {
    localStorage.setItem('n8n_preset_id', currentPresetId);
  }, [currentPresetId]);

  useEffect(() => {
    localStorage.setItem('n8n_dev_mode', String(isDevMode));
  }, [isDevMode]);

  useEffect(() => {
    if (analysisResult) {
      localStorage.setItem('n8n_analysis_result', JSON.stringify(analysisResult));
    }
  }, [analysisResult]);

  useEffect(() => {
    localStorage.setItem('n8n_submission_history', JSON.stringify(history));
  }, [history]);

  // Ping endpoint status
  const checkStatus = useCallback(async () => {
    setEndpointStatus((prev) => ({ ...prev, checking: true }));
    try {
      const res = await fetch(`/api/n8n/check-status?url=${encodeURIComponent(targetUrl)}`);
      const data = await res.json();
      setEndpointStatus({
        status: data.status,
        statusText: data.statusText,
        durationMs: data.durationMs,
        isListeningPrompt: !!data.isListeningPrompt,
        isReady: !!data.isReady,
        title: data.title || null,
        lastChecked: new Date().toLocaleTimeString(),
        checking: false,
      });
    } catch {
      setEndpointStatus({
        status: null,
        statusText: 'Failed to ping',
        durationMs: null,
        isListeningPrompt: false,
        isReady: false,
        title: null,
        lastChecked: new Date().toLocaleTimeString(),
        checking: false,
      });
    }
  }, [targetUrl]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectPreset = (preset: FormPreset) => {
    setCurrentPresetId(preset.id);
    setFields(preset.fields);
    setFormTitle(preset.title);
    const initial: Record<string, any> = {};
    preset.fields.forEach((f) => {
      initial[f.name] = f.defaultValue ?? '';
    });
    setFormData(initial);
  };

  const handleFillSampleData = () => {
    const isResume = currentPresetId === 'resume-analyser';

    const sampleValues: Record<string, any> = isResume
      ? {
          candidateName: 'Sandhya Rani',
          email: 'sandhyarani@example.com',
          phone: '+1 (415) 555-0198',
          targetRole: 'Full Stack Engineer',
          experienceLevel: '3 - 5 Years (Mid-level)',
          keySkills: 'React, TypeScript, Node.js, Express, Python, n8n Workflows, Tailwind CSS, PostgreSQL',
          resumeSummary:
            'Passionate Full Stack Engineer with 4+ years of hands-on experience designing and building responsive web applications and automated workflow agents. Proven track record in orchestrating API integrations with n8n, optimizing web performance, and deploying cloud services.',
          portfolioUrl: 'https://github.com/Sandhyarani-781',
          notifyResults: true,
        }
      : {
          fullName: 'Alex Vance',
          clientName: 'Alex Vance',
          requesterName: 'Alex Vance',
          respondentName: 'Alex Vance',
          name: 'Alex Vance',
          email: 'alex.vance@tech-solutions.io',
          phone: '+1 (415) 555-0198',
          company: 'Vance Tech Group',
          companyName: 'Vance Tech Group',
          inquiryType: 'Workflow Automation',
          severity: 'Medium - General Question',
          urgency: 'Immediate (Within 48 hours)',
          issueSummary: 'Question regarding automated resume analysis workflow',
          message:
            'We are looking to automate our candidate resume intake process, extracting key technical skills and notifying our hiring managers automatically.',
          reproSteps:
            '1. Submit resume via intake portal.\n2. n8n workflow parses key attributes.\n3. Candidate receives instant score & acknowledgment.',
          rating: '10 - Extremely Satisfied',
          favoriteFeature: 'Super clean, friendly design and zero-delay automated submissions',
          feedbackNotes:
            'The portal is intuitive and made testing our n8n automation effortless!',
          agreeToContact: true,
        };

    const updated = { ...formData };
    fields.forEach((f) => {
      if (sampleValues[f.name] !== undefined) {
        updated[f.name] = sampleValues[f.name];
      } else if (f.type === 'email') {
        updated[f.name] = 'sample.user@domain.com';
      } else if (f.type === 'tel') {
        updated[f.name] = '+1 (555) 234-5678';
      } else if (f.type === 'number') {
        updated[f.name] = 42;
      } else if (f.type === 'checkbox') {
        updated[f.name] = true;
      } else if (f.type === 'select' && f.options && f.options.length > 0) {
        updated[f.name] = f.options[0];
      } else if (f.type === 'textarea') {
        updated[f.name] = 'Sample automated test message generated for n8n workflow verification.';
      } else {
        updated[f.name] = `Sample ${f.label}`;
      }
    });

    setFormData(updated);
  };

  const handleSaveFields = (newFields: FormField[]) => {
    setFields(newFields);
    const updated: Record<string, any> = {};
    newFields.forEach((f) => {
      updated[f.name] = formData[f.name] !== undefined ? formData[f.name] : (f.defaultValue ?? '');
    });
    setFormData(updated);
  };

  // Submit handler - Dispatches to n8n Resume Agent and generates Job Matching
  const handleSubmitForm = async (
    method: 'relay' | 'direct',
    format: 'json' | 'form-urlencoded'
  ): Promise<SubmissionLogItem> => {
    const timestamp = new Date().toISOString();
    const id = `sub_${Date.now()}`;
    const startTime = Date.now();

    let itemResult: SubmissionLogItem;

    if (method === 'relay') {
      try {
        const response = await fetch('/api/n8n/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetUrl,
            payload: formData,
            format,
          }),
        });

        const data = await response.json();
        itemResult = {
          id,
          timestamp,
          targetUrl,
          format,
          payload: { ...formData },
          status: data.status,
          statusText: data.statusText,
          durationMs: data.durationMs,
          success: data.success,
          isListeningPrompt: !!data.isListeningPrompt,
          responseData: data.data || data.rawSnippet,
          error: data.error,
        };
      } catch (err: any) {
        // Fallback to direct client-side fetch if relay is blocked
        try {
          const res = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            mode: 'cors',
          });
          const text = await res.text();
          itemResult = {
            id,
            timestamp,
            targetUrl,
            format,
            payload: { ...formData },
            status: res.status,
            statusText: res.statusText,
            durationMs: Date.now() - startTime,
            success: res.ok,
            isListeningPrompt: text.includes("Form Trigger isn't listening yet"),
            responseData: text,
          };
        } catch (directErr: any) {
          itemResult = {
            id,
            timestamp,
            targetUrl,
            format,
            payload: { ...formData },
            status: 0,
            durationMs: Date.now() - startTime,
            success: false,
            error: err.message,
          };
        }
      }
    } else {
      // Direct client-side fetch to n8n
      try {
        const res = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
          mode: 'cors',
        });
        const durationMs = Date.now() - startTime;
        const text = await res.text();
        itemResult = {
          id,
          timestamp,
          targetUrl,
          format,
          payload: { ...formData },
          status: res.status,
          statusText: res.statusText,
          durationMs,
          success: res.ok,
          isListeningPrompt: text.includes("Form Trigger isn't listening yet"),
          responseData: text,
        };
      } catch (err: any) {
        itemResult = {
          id,
          timestamp,
          targetUrl,
          format,
          payload: { ...formData },
          status: 0,
          durationMs: Date.now() - startTime,
          success: false,
          error: err.message,
        };
      }
    }

    setHistory((prev) => [itemResult, ...prev]);
    checkStatus();

    // Trigger AI Resume Analysis & Matching Jobs Engine
    const profile: ResumeProfile = {
      fullName: formData.candidateName || formData.fullName || 'Sandhya Rani',
      email: formData.email || '',
      phone: formData.phone || '',
      targetRole: formData.targetRole || formData.inquiryType || 'Full Stack Engineer',
      experienceLevel: formData.experienceLevel || '3 - 5 Years (Mid-level)',
      preferredLocation: 'Remote',
      workplaceType: 'Remote',
      resumeText:
        (formData.resumeSummary || '') + ' ' + (formData.keySkills || '') + ' ' + (formData._attachedFileContent || ''),
      portfolioUrl: formData.portfolioUrl || '',
    };

    const newAnalysis = analyzeResumeLocally(profile, {
      status: itemResult.status || 200,
      durationMs: itemResult.durationMs || 500,
      isListeningPrompt: !!itemResult.isListeningPrompt,
      rawResponse: itemResult.responseData,
    });

    setAnalysisResult(newAnalysis);

    // Smoothly transition candidate to the Matching Jobs & Results tab
    setTimeout(() => {
      setActiveTab('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);

    return itemResult;
  };

  const handleCustomPayloadSubmit = async (
    payload: Record<string, any>,
    format: 'json' | 'form-urlencoded'
  ) => {
    const timestamp = new Date().toISOString();
    const id = `sub_${Date.now()}`;
    const response = await fetch('/api/n8n/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUrl,
        payload,
        format,
      }),
    });
    const data = await response.json();
    const item: SubmissionLogItem = {
      id,
      timestamp,
      targetUrl,
      format,
      payload,
      status: data.status,
      statusText: data.statusText,
      durationMs: data.durationMs,
      success: data.success,
      isListeningPrompt: !!data.isListeningPrompt,
      responseData: data.data || data.rawSnippet,
      error: data.error,
    };
    setHistory((prev) => [item, ...prev]);
    checkStatus();
    return data;
  };

  const handleRetry = async (item: SubmissionLogItem) => {
    await handleCustomPayloadSubmit(item.payload, item.format);
  };

  const isTestMode = targetUrl.includes('/form-test/');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-[#EA4B71] selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        status={endpointStatus}
        onRefreshStatus={checkStatus}
        targetUrl={targetUrl}
        isDevMode={isDevMode}
        setIsDevMode={setIsDevMode}
        hasAnalysisResult={!!analysisResult}
      />

      {/* Target Endpoint Sub-header */}
      <EndpointBar
        targetUrl={targetUrl}
        setTargetUrl={setTargetUrl}
        status={endpointStatus}
        onRefreshStatus={checkStatus}
        isDevMode={isDevMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeTab === 'portal' && (
          <>
            <FriendlyHero
              currentPresetId={currentPresetId}
              presets={FORM_PRESETS}
              onSelectPreset={handleSelectPreset}
              onAutoFillDemo={handleFillSampleData}
              formTitle={formTitle}
            />

            {/* Quick Link to Matching Jobs if already analyzed */}
            {analysisResult && (
              <div className="bg-gradient-to-r from-emerald-500/15 via-slate-900 to-indigo-500/15 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Active Resume Analysis for {analysisResult.candidateName} (ATS Score: {analysisResult.overallScore}/100)
                    </h3>
                    <p className="text-xs text-slate-400">
                      {analysisResult.matchedJobs.length} matching job opportunities found for {analysisResult.targetRole}.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('results')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all hover:scale-[1.02] shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  <span>View Matching Jobs ({analysisResult.matchedJobs.length})</span>
                </button>
              </div>
            )}

            <PortalForm
              formTitle={formTitle}
              fields={fields}
              formData={formData}
              onFieldChange={handleFieldChange}
              onFillSampleData={handleFillSampleData}
              onOpenBuilder={() => setIsBuilderOpen(true)}
              onGoToInspector={() => setActiveTab('inspector')}
              onSubmit={handleSubmitForm}
              targetUrl={targetUrl}
              isTestMode={isTestMode}
            />
          </>
        )}

        {activeTab === 'results' && analysisResult && (
          <ResumeAnalysisDashboard
            result={analysisResult}
            onReAnalyze={() => setActiveTab('portal')}
            targetUrl={targetUrl}
          />
        )}

        {activeTab === 'inspector' && (
          <PayloadInspector
            formData={formData}
            targetUrl={targetUrl}
            onSubmitCustomPayload={handleCustomPayloadSubmit}
          />
        )}

        {activeTab === 'history' && (
          <SubmissionHistory
            history={history}
            onClearHistory={() => setHistory([])}
            onRetry={handleRetry}
            onGoToSubmit={() => setActiveTab('portal')}
          />
        )}

        {activeTab === 'preview' && (
          <LiveEmbedViewer targetUrl={targetUrl} />
        )}

        {activeTab === 'guide' && (
          <WorkflowGuide targetUrl={targetUrl} />
        )}
      </main>

      {/* Friendly Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-[#EA4B71] to-[#FF6D5A] flex items-center justify-center text-white">
              <Zap className="w-3 h-3 fill-white" />
            </div>
            <span className="text-slate-300 font-bold">ResumeAI Matcher</span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-500">n8n Agent: sandhyarani-781.app.n8n.cloud</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('results')}
              className="hover:text-emerald-400 transition-colors font-medium"
            >
              Matching Jobs
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className="hover:text-slate-200 transition-colors"
            >
              How It Works
            </button>
            <a
              href="https://sandhyarani-781.app.n8n.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1 transition-colors font-medium text-slate-300"
            >
              <span>n8n Agent Canvas</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Form Builder Modal */}
      <FormBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        fields={fields}
        onSaveFields={handleSaveFields}
        onSelectPreset={handleSelectPreset}
        formTitle={formTitle}
        setFormTitle={setFormTitle}
      />
    </div>
  );
}
