import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  RotateCcw,
  Zap,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Briefcase,
  FileText,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Check,
  Paperclip
} from 'lucide-react';
import { FormField, SubmissionLogItem } from '../types/n8n';
import { FileUploadZone } from './FileUploadZone';

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
  isTestMode: boolean;
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
  isTestMode,
}) => {
  const [method, setMethod] = useState<'relay' | 'direct'>('relay');
  const [format, setFormat] = useState<'json' | 'form-urlencoded'>('json');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<SubmissionLogItem | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [attachedFileName, setAttachedFileName] = useState<string | undefined>(formData._attachedFileName);

  const getFieldIcon = (field: FormField) => {
    const name = field.name.toLowerCase();
    if (name.includes('name') || name.includes('candidate') || name.includes('user')) {
      return <User className="w-3.5 h-3.5 text-slate-400" />;
    }
    if (name.includes('email')) {
      return <Mail className="w-3.5 h-3.5 text-slate-400" />;
    }
    if (name.includes('phone') || name.includes('tel')) {
      return <Phone className="w-3.5 h-3.5 text-slate-400" />;
    }
    if (name.includes('role') || name.includes('job') || name.includes('company') || name.includes('inquiry')) {
      return <Briefcase className="w-3.5 h-3.5 text-slate-400" />;
    }
    if (name.includes('date') || field.type === 'date') {
      return <Calendar className="w-3.5 h-3.5 text-slate-400" />;
    }
    return <FileText className="w-3.5 h-3.5 text-slate-400" />;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const val = formData[field.name];
      if (field.required) {
        if (val === undefined || val === null || val === '') {
          newErrors[field.name] = `Please enter your ${field.label.toLowerCase()}`;
        } else if (field.type === 'checkbox' && !val) {
          newErrors[field.name] = 'Please check this box to proceed';
        }
      }
      if (field.type === 'email' && val && typeof val === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          newErrors[field.name] = 'Please enter a valid email address (e.g. name@domain.com)';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Smooth scroll to top of form to see error
      window.scrollTo({ top: 350, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setLastSubmission(null);
    setSubmittedSuccess(false);

    try {
      const result = await onSubmit(method, format);
      setLastSubmission(result);
      if (result.success && !result.isListeningPrompt) {
        setSubmittedSuccess(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    fields.forEach((f) => onFieldChange(f.name, f.defaultValue ?? ''));
    setAttachedFileName(undefined);
    onFieldChange('_attachedFileName', undefined);
    onFieldChange('_attachedFileContent', undefined);
    setErrors({});
    setLastSubmission(null);
    setSubmittedSuccess(false);
  };

  const handleFileLoaded = (filename: string, content: string, sizeKb: number) => {
    setAttachedFileName(filename);
    onFieldChange('_attachedFileName', filename);
    onFieldChange('_attachedFileSizeKb', sizeKb);
    // If there is a resume summary or notes field, suggest appending or auto-filling
    if (formData.resumeSummary === '' || formData.resumeSummary === undefined) {
      onFieldChange('resumeSummary', `[Uploaded file: ${filename}]\n${content.slice(0, 1500)}`);
    } else {
      onFieldChange('_attachedFileContent', content.slice(0, 5000));
    }
  };

  const isResumePreset = fields.some((f) => f.name.includes('candidate') || f.name.includes('targetRole'));

  return (
    <div className="space-y-6">
      {/* Primary Form Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden transition-all">
        {/* Friendly Top Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#EA4B71] to-[#FF6D5A] flex items-center justify-center text-white shadow-md shadow-[#EA4B71]/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {formTitle}
              </h2>
              <p className="text-xs text-slate-400">
                Please fill in the information below. All required fields are marked with <span className="text-[#EA4B71] font-bold">*</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenBuilder}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Customize Fields</span>
            </button>
          </div>
        </div>

        {/* Main Form Fields */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* File Upload Zone (Particularly friendly for Resumes & Documents) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isResumePreset ? 'Attach Resume / CV Document (Optional)' : 'Attach Supporting Document (Optional)'}</span>
              </span>
              <span className="text-[11px] text-slate-500 font-normal">PDF, DOCX, TXT</span>
            </label>
            <FileUploadZone
              onFileLoaded={handleFileLoaded}
              currentFileName={attachedFileName}
              onClearFile={() => {
                setAttachedFileName(undefined);
                onFieldChange('_attachedFileName', undefined);
                onFieldChange('_attachedFileContent', undefined);
              }}
            />
          </div>

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
                      <span className="flex items-center gap-1.5">
                        {getFieldIcon(field)}
                        <span>{field.label}</span>
                        {field.required && <span className="text-[#EA4B71] text-sm leading-none">*</span>}
                      </span>
                    </label>
                  )}

                  {/* Input Rendering based on type */}
                  {field.type === 'textarea' ? (
                    <div className="relative">
                      <textarea
                        rows={4}
                        value={value}
                        onChange={(e) => onFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className={`w-full bg-slate-950/90 border rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#EA4B71] transition-all resize-none ${
                          errors[field.name] ? 'border-rose-500/80 ring-1 ring-rose-500/40' : 'border-slate-800 focus:border-[#EA4B71]/50'
                        }`}
                      />
                    </div>
                  ) : field.type === 'select' ? (
                    <div className="relative">
                      <select
                        value={value}
                        onChange={(e) => onFieldChange(field.name, e.target.value)}
                        className={`w-full bg-slate-950/90 border rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#EA4B71] transition-all appearance-none cursor-pointer pr-10 ${
                          errors[field.name] ? 'border-rose-500/80 ring-1 ring-rose-500/40' : 'border-slate-800 focus:border-[#EA4B71]/50'
                        }`}
                      >
                        <option value="">Please select an option...</option>
                        {(field.options || []).map((opt) => (
                          <option key={opt} value={opt} className="bg-slate-900 text-slate-100">
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  ) : field.type === 'checkbox' ? (
                    <label className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer select-none group hover:border-slate-700 transition-colors">
                      <input
                        type="checkbox"
                        checked={!!value}
                        onChange={(e) => onFieldChange(field.name, e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-slate-700 text-[#EA4B71] focus:ring-0 focus:ring-offset-0 bg-slate-900 cursor-pointer"
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
                    <div className="relative">
                      <input
                        type={field.type}
                        value={value}
                        onChange={(e) => onFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className={`w-full bg-slate-950/90 border rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#EA4B71] transition-all ${
                          errors[field.name] ? 'border-rose-500/80 ring-1 ring-rose-500/40' : 'border-slate-800 focus:border-[#EA4B71]/50'
                        }`}
                      />
                    </div>
                  )}

                  {/* Error label */}
                  {errors[field.name] && (
                    <span className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors[field.name]}</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Expandable Advanced Options (kept clean and tidy) */}
          <div className="pt-2 border-t border-slate-800/60">
            <button
              type="button"
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors"
            >
              <span>Advanced Delivery Options</span>
              {showAdvancedSettings ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAdvancedSettings && (
              <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">Connection Mode:</span>
                  <div className="inline-flex rounded-lg p-0.5 bg-slate-900 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setMethod('relay')}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        method === 'relay' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Relay (Recommended)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMethod('direct')}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        method === 'direct' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Direct Browser
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Format:</span>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-300 text-xs focus:outline-none"
                  >
                    <option value="json">JSON (Standard)</option>
                    <option value="form-urlencoded">Form URL-Encoded</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <button
                type="button"
                onClick={handleResetForm}
                className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors py-2 px-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Form</span>
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={onFillSampleData}
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors py-2 px-1 font-medium"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fill Sample Data</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#EA4B71] to-[#FF6D5A] hover:opacity-95 text-white shadow-xl shadow-[#EA4B71]/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending to Workflow...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Application Now</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Feedback / Result Card */}
        {lastSubmission && (
          <div className="px-6 pb-6 animate-in fade-in duration-300">
            {lastSubmission.isListeningPrompt ? (
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200 space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-300">
                      Almost there! Your workflow is in Test Standby mode
                    </h4>
                    <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                      Your submission reached your n8n workflow successfully in <strong>{lastSubmission.durationMs}ms</strong>! To complete the test run:
                    </p>
                    <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-amber-500/20 text-xs text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="font-semibold text-white block">Step in n8n Cloud:</span>
                        <span className="text-slate-400 text-[11px]">
                          Click <strong>"Execute step"</strong> inside your n8n Form Trigger node, then re-send!
                        </span>
                      </div>
                      <a
                        href="https://sandhyarani-781.app.n8n.cloud"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shrink-0"
                      >
                        <span>Open n8n Editor</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold text-xs transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try Sending Submission Again</span>
                  </button>
                </div>
              </div>
            ) : lastSubmission.success ? (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-emerald-300">
                      Submission Received Successfully!
                    </h4>
                    <p className="text-xs text-emerald-300/80 mt-0.5">
                      Your details were captured and the automated workflow finished in <strong>{lastSubmission.durationMs}ms</strong>.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleResetForm}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-semibold text-xs transition-colors shrink-0"
                >
                  Submit Another Entry
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-200 flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="text-xs space-y-1 flex-1">
                  <h4 className="text-sm font-bold text-rose-300">
                    Submission Error ({lastSubmission.status || 'Connection Error'})
                  </h4>
                  <p className="text-rose-200/90 leading-relaxed">
                    {lastSubmission.error || 'Failed to submit. Please check your connection or switch delivery mode.'}
                  </p>
                  <button
                    onClick={handleSubmit}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-semibold text-xs transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Now</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
