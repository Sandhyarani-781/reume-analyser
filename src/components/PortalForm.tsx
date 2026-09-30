import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Sliders, 
  Code2, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  ExternalLink,
  RotateCcw,
  Zap,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { FormField, FormPreset, SubmissionLogItem } from '../types/n8n';

interface PortalFormProps {
  formTitle: string;
  fields: FormField[];
  formData: Record<string, any>;
  onFieldChange: (name: string, value: any) => void;
  onFillSampleData: () => void;
  onOpenBuilder: () => void;
  onGoToInspector: () => void;
  onSubmit: (method: 'relay' | 'direct', format: 'json' | 'form-urlencoded') => Promise<SubmissionLogItem>;
  targetUrl: string;
}

export const PortalForm: React.FC<PortalFormProps> = ({
  formTitle,
  fields,
  formData,
  onFieldChange,
  onFillSampleData,
  onOpenBuilder,
  onGoToInspector,
  onSubmit,
  targetUrl,
}) => {
  const [method, setMethod] = useState<'relay' | 'direct'>('relay');
  const [format, setFormat] = useState<'json' | 'form-urlencoded'>('json');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<SubmissionLogItem | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successSubmitted, setSuccessSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const val = formData[field.name];
      if (field.required) {
        if (val === undefined || val === null || val === '') {
          newErrors[field.name] = `${field.label} is required`;
        } else if (field.type === 'checkbox' && !val) {
          newErrors[field.name] = 'You must accept to proceed';
        }
      }
      if (field.type === 'email' && val && typeof val === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          newErrors[field.name] = 'Please enter a valid email address';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setLastSubmission(null);
    setSuccessSubmitted(false);

    try {
      const result = await onSubmit(method, format);
      setLastSubmission(result);
      if (result.success && !result.isListeningPrompt) {
        setSuccessSubmitted(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    fields.forEach((f) => onFieldChange(f.name, f.defaultValue ?? ''));
    setErrors({});
    setLastSubmission(null);
    setSuccessSubmitted(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#EA4B71]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-[#EA4B71] animate-ping" />
              <span>Live Automation Webhook Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {formTitle}
            </h1>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Submit your project details, inquiry, or operational requests. All form submissions trigger automated workflows configured on n8n Cloud.
            </p>
          </div>

          {/* Quick Helper Actions */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={onFillSampleData}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all hover:scale-[1.02]"
              title="Populate all fields with test data"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Fill Sample Data</span>
            </button>

            <button
              type="button"
              onClick={onOpenBuilder}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Customize Fields</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Form Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Form Controls Sub-bar */}
        <div className="px-6 py-3.5 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium">Relay Mode:</span>
            <div className="inline-flex rounded-lg p-0.5 bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setMethod('relay')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  method === 'relay'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Routes via backend proxy to bypass CORS restrictions"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Backend Relay</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('direct')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  method === 'direct'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Direct browser fetch to n8n"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Direct Client</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Format:</span>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 text-xs focus:outline-none"
            >
              <option value="json">JSON (application/json)</option>
              <option value="form-urlencoded">Form URL-Encoded</option>
            </select>
          </div>
        </div>

        {/* The Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {fields.map((field) => {
              const value = formData[field.name] ?? '';
              const isColSpan2 = field.type === 'textarea' || field.type === 'checkbox';

              return (
                <div
                  key={field.id}
                  className={`flex flex-col ${isColSpan2 ? 'sm:col-span-2' : ''}`}
                >
                  {field.type !== 'checkbox' && (
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>
                        {field.label}{' '}
                        {field.required && <span className="text-[#EA4B71]">*</span>}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 font-normal">
                        {field.name}
                      </span>
                    </label>
                  )}

                  {/* Input Rendering based on type */}
                  {field.type === 'textarea' ? (
                    <textarea
                      rows={4}
                      value={value}
                      onChange={(e) => onFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className={`w-full bg-slate-950 border rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#EA4B71] transition-all resize-none ${
                        errors[field.name] ? 'border-rose-500/80 ring-1 ring-rose-500/40' : 'border-slate-800'
                      }`}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={value}
                      onChange={(e) => onFieldChange(field.name, e.target.value)}
                      className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#EA4B71] transition-all ${
                        errors[field.name] ? 'border-rose-500/80 ring-1 ring-rose-500/40' : 'border-slate-800'
                      }`}
                    >
                      <option value="">Select an option...</option>
                      {(field.options || []).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <label className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer select-none group hover:border-slate-700 transition-colors">
                      <input
                        type="checkbox"
                        checked={!!value}
                        onChange={(e) => onFieldChange(field.name, e.target.checked)}
                        className="mt-0.5 rounded border-slate-700 text-[#EA4B71] focus:ring-0 focus:ring-offset-0 bg-slate-900"
                      />
                      <div className="text-xs">
                        <span className="text-slate-200 font-medium group-hover:text-white">
                          {field.label}{' '}
                          {field.required && <span className="text-[#EA4B71]">*</span>}
                        </span>
                        {field.helpText && (
                          <p className="text-slate-500 text-[11px] mt-0.5">{field.helpText}</p>
                        )}
                      </div>
                    </label>
                  ) : (
                    <input
                      type={field.type}
                      value={value}
                      onChange={(e) => onFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className={`w-full bg-slate-950 border rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#EA4B71] transition-all ${
                        errors[field.name] ? 'border-rose-500/80 ring-1 ring-rose-500/40' : 'border-slate-800'
                      }`}
                    />
                  )}

                  {/* Error hint */}
                  {errors[field.name] && (
                    <span className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors[field.name]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetForm}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors py-2 px-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Form</span>
              </button>

              <button
                type="button"
                onClick={onGoToInspector}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors py-2 px-1"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>View Raw JSON</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#EA4B71] to-[#FF6D5A] hover:opacity-95 text-white shadow-lg shadow-[#EA4B71]/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting to n8n Cloud...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Dispatch Submission to n8n</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Feedback / Result Card */}
        {lastSubmission && (
          <div className="px-6 pb-6">
            {lastSubmission.isListeningPrompt ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-300">
                      Form Trigger Isn't Listening Yet (HTTP 404 in Test Mode)
                    </h4>
                    <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                      Your submission was sent directly to <code className="font-mono bg-slate-950 px-1 py-0.5 rounded text-amber-300">{targetUrl}</code> in {lastSubmission.durationMs}ms. n8n cloud returned the expected test standby response:
                    </p>
                    <div className="mt-2 p-2.5 rounded bg-slate-950/80 border border-amber-500/20 text-[11px] font-mono text-amber-300">
                      "Click the 'Execute step' button in your form trigger"
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-amber-500/20 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300">Next Step:</span>
                    <a
                      href="https://sandhyarani-781.app.n8n.cloud"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-amber-300 hover:text-white underline underline-offset-2 flex items-center gap-1"
                    >
                      <span>Open n8n Canvas</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-medium text-xs transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try Sending Again</span>
                  </button>
                </div>
              </div>
            ) : lastSubmission.success ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-300">
                      Submission Successfully Processed! (HTTP {lastSubmission.status})
                    </h4>
                    <p className="text-xs text-emerald-300/80 mt-0.5">
                      Workflow executed cleanly in {lastSubmission.durationMs}ms. Receipt recorded in history.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleResetForm}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-medium text-xs transition-colors shrink-0"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <h4 className="text-sm font-semibold text-rose-300">
                    Submission Error ({lastSubmission.status || 'Network / CORS issue'})
                  </h4>
                  <p className="text-rose-200/90 leading-relaxed">
                    {lastSubmission.error || 'Failed to communicate with n8n endpoint. If using Direct mode, try switching to Backend Relay mode above.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
