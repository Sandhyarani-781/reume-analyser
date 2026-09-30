import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { EndpointBar } from './components/EndpointBar';
import { PortalForm } from './components/PortalForm';
import { FormBuilderModal } from './components/FormBuilderModal';
import { PayloadInspector } from './components/PayloadInspector';
import { SubmissionHistory } from './components/SubmissionHistory';
import { LiveEmbedViewer } from './components/LiveEmbedViewer';
import { WorkflowGuide } from './components/WorkflowGuide';
import { FormField, FormPreset, SubmissionLogItem, EndpointStatus } from './types/n8n';
import { DEFAULT_N8N_TEST_URL, FORM_PRESETS } from './constants/presets';
import { Zap, Heart, ExternalLink } from 'lucide-react';

export default function App() {
  // Target URL state
  const [targetUrl, setTargetUrl] = useState<string>(() => {
    return localStorage.getItem('n8n_target_url') || DEFAULT_N8N_TEST_URL;
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'portal' | 'inspector' | 'history' | 'preview' | 'guide'>('portal');

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

  // Check on mount or url change
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFillSampleData = () => {
    const sampleValues: Record<string, any> = {
      fullName: 'Alex Vance',
      clientName: 'Alex Vance',
      requesterName: 'Alex Vance',
      respondentName: 'Alex Vance',
      name: 'Alex Vance',
      email: 'alex.vance@automation-tech.io',
      phone: '+1 (415) 555-0198',
      company: 'Vance Dynamics Group',
      companyName: 'Vance Dynamics Group',
      inquiryType: 'Workflow Automation',
      severity: 'Medium - Degraded functionality',
      budgetRange: '$5,000 - $10,000',
      urgency: 'Immediate (Within 48 hours)',
      targetDeadline: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      issueSummary: 'Batch webhook records need synchronization with Google Sheets & Slack alerts',
      message:
        'We require an automated end-to-end webhook bridge that parses customer leads from this portal, logs them to Google Sheets, and triggers a confirmation notification.',
      specifications:
        '1. Intake client record.\n2. Verify email address.\n3. Create task in Project Board.\n4. Send automated welcome email.',
      reproSteps:
        '1. Submit payload via portal.\n2. Observe trigger node in n8n.\n3. Verify output data mapping.',
      rating: '10 - Extremely Satisfied',
      favoriteFeature: 'Zero-latency webhook relay and seamless n8n integration',
      feedbackNotes:
        'The portal is blazing fast and the field customizer makes it effortless to test multiple webhook schemas!',
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

  const handleSelectPreset = (preset: FormPreset) => {
    setFields(preset.fields);
    setFormTitle(preset.title);
    const initial: Record<string, any> = {};
    preset.fields.forEach((f) => {
      initial[f.name] = f.defaultValue ?? '';
    });
    setFormData(initial);
  };

  const handleSaveFields = (newFields: FormField[]) => {
    setFields(newFields);
    // Keep existing form values if matching field name
    const updated: Record<string, any> = {};
    newFields.forEach((f) => {
      updated[f.name] = formData[f.name] !== undefined ? formData[f.name] : (f.defaultValue ?? '');
    });
    setFormData(updated);
  };

  // Submit handler
  const handleSubmitForm = async (
    method: 'relay' | 'direct',
    format: 'json' | 'form-urlencoded'
  ): Promise<SubmissionLogItem> => {
    const timestamp = new Date().toISOString();
    const id = `sub_${Date.now()}`;
    const startTime = Date.now();

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
        const item: SubmissionLogItem = {
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

        setHistory((prev) => [item, ...prev]);
        checkStatus();
        return item;
      } catch (err: any) {
        // Automatic fallback to direct client-side fetch if relay is unavailable (e.g. purely static Vercel deployment)
        try {
          let body: string;
          const headers: Record<string, string> = {
            'Accept': 'application/json, text/html, */*',
          };
          if (format === 'form-urlencoded') {
            const params = new URLSearchParams();
            Object.entries(formData).forEach(([k, v]) => {
              if (v !== undefined && v !== null) {
                params.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
              }
            });
            body = params.toString();
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
          } else {
            body = JSON.stringify(formData);
            headers['Content-Type'] = 'application/json';
          }

          const res = await fetch(targetUrl, {
            method: 'POST',
            headers,
            body,
            mode: 'cors',
          });

          const durationMs = Date.now() - startTime;
          const text = await res.text();
          let parsed = text;
          try {
            parsed = JSON.parse(text);
          } catch {
            // ignore
          }

          const fallbackItem: SubmissionLogItem = {
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
            responseData: parsed,
          };
          setHistory((prev) => [fallbackItem, ...prev]);
          checkStatus();
          return fallbackItem;
        } catch (directErr: any) {
          const item: SubmissionLogItem = {
            id,
            timestamp,
            targetUrl,
            format,
            payload: { ...formData },
            status: 0,
            durationMs: Date.now() - startTime,
            success: false,
            error: `Relay: ${err.message}. Direct fallback: ${directErr.message}`,
          };
          setHistory((prev) => [item, ...prev]);
          return item;
        }
      }
    } else {
      // Direct client-side fetch to n8n
      try {
        let body: string;
        const headers: Record<string, string> = {
          'Accept': 'application/json, text/html, */*',
        };

        if (format === 'form-urlencoded') {
          const params = new URLSearchParams();
          Object.entries(formData).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
              params.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
            }
          });
          body = params.toString();
          headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } else {
          body = JSON.stringify(formData);
          headers['Content-Type'] = 'application/json';
        }

        const res = await fetch(targetUrl, {
          method: 'POST',
          headers,
          body,
          mode: 'cors',
        });

        const durationMs = Date.now() - startTime;
        const text = await res.text();
        let parsed = text;
        try {
          parsed = JSON.parse(text);
        } catch {
          // ignore
        }

        const item: SubmissionLogItem = {
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
          responseData: parsed,
        };
        setHistory((prev) => [item, ...prev]);
        checkStatus();
        return item;
      } catch (err: any) {
        const item: SubmissionLogItem = {
          id,
          timestamp,
          targetUrl,
          format,
          payload: { ...formData },
          status: 0,
          durationMs: Date.now() - startTime,
          success: false,
          error: `${err.message} (Direct fetch was likely blocked by CORS or mixed-content policies. Try Backend Relay mode!)`,
        };
        setHistory((prev) => [item, ...prev]);
        return item;
      }
    }
  };

  // Submit custom payload from Inspector
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-[#EA4B71] selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        status={endpointStatus}
        onRefreshStatus={checkStatus}
        targetUrl={targetUrl}
      />

      {/* Target Endpoint Sub-header */}
      <EndpointBar
        targetUrl={targetUrl}
        setTargetUrl={setTargetUrl}
        status={endpointStatus}
        onRefreshStatus={checkStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'portal' && (
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
          />
        )}

        {activeTab === 'preview' && (
          <LiveEmbedViewer targetUrl={targetUrl} />
        )}

        {activeTab === 'guide' && (
          <WorkflowGuide targetUrl={targetUrl} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-tr from-[#EA4B71] to-[#FF6D5A] flex items-center justify-center text-white">
              <Zap className="w-3 h-3 fill-white" />
            </div>
            <span className="text-slate-300 font-medium">n8n Connect Hub</span>
            <span className="text-slate-600">·</span>
            <span>Target: sandhyarani-781.app.n8n.cloud</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('guide')}
              className="hover:text-slate-200 transition-colors"
            >
              Workflow Blueprint
            </button>
            <button
              onClick={() => setIsBuilderOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              Schema Customizer
            </button>
            <a
              href="https://sandhyarani-781.app.n8n.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>n8n Cloud Canvas</span>
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
