import React from 'react';
import { 
  Sparkles, 
  FileText, 
  Briefcase, 
  HelpCircle, 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { FormPreset } from '../types/n8n';

interface FriendlyHeroProps {
  currentPresetId: string;
  presets: FormPreset[];
  onSelectPreset: (preset: FormPreset) => void;
  onAutoFillDemo: () => void;
  formTitle: string;
}

export const FriendlyHero: React.FC<FriendlyHeroProps> = ({
  currentPresetId,
  presets,
  onSelectPreset,
  onAutoFillDemo,
  formTitle,
}) => {
  const getPresetIcon = (id: string) => {
    switch (id) {
      case 'resume-analyser':
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'contact-inquiry':
        return <Briefcase className="w-4 h-4 text-indigo-400" />;
      case 'support-ticket':
        return <HelpCircle className="w-4 h-4 text-amber-400" />;
      case 'feedback-survey':
        return <MessageSquare className="w-4 h-4 text-pink-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Friendly Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Soft Background Accents */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-gradient-to-br from-[#EA4B71]/15 to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          {/* Friendly Top Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium">Direct n8n Cloud Automation Active</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Private &amp; Secure</span>
              </span>
              <span className="hidden sm:inline text-slate-700">·</span>
              <span className="hidden sm:flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Processing</span>
              </span>
            </div>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {formTitle}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              Welcome! Use this friendly portal to submit your resume, project inquiry, or support request. Your submission connects instantly to our automated workflow with real-time tracking.
            </p>
          </div>

          {/* Quick Preset Selector Cards */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Choose What You'd Like to Submit:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {presets.map((preset) => {
                const isActive = currentPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onSelectPreset(preset)}
                    className={`flex items-start gap-2.5 p-3 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-slate-800 text-white border-2 border-[#EA4B71] shadow-lg shadow-[#EA4B71]/15 scale-[1.02]'
                        : 'bg-slate-950/60 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">{getPresetIcon(preset.id)}</div>
                    <div>
                      <span className="font-semibold text-xs block leading-snug">
                        {preset.id === 'resume-analyser'
                          ? 'Resume Analyser'
                          : preset.id === 'contact-inquiry'
                          ? 'Client Inquiry'
                          : preset.id === 'support-ticket'
                          ? 'Help & Support'
                          : 'Feedback'}
                      </span>
                      <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {preset.fields.length} simple fields
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Friendly Auto-Fill Helper Bar */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 border border-slate-800/90 rounded-xl p-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Want to test how it works right away without typing?
              </span>
            </div>
            <button
              type="button"
              onClick={onAutoFillDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white shadow transition-all hover:scale-[1.02] text-xs shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>Auto-Fill With Demo Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Simple Steps Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3.5">
          <div className="w-7 h-7 rounded-full bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
            1
          </div>
          <div>
            <h4 className="font-semibold text-white text-xs">Fill In Your Details</h4>
            <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
              Enter your information or attach your resume document with one click.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3.5">
          <div className="w-7 h-7 rounded-full bg-[#EA4B71]/15 text-[#FF6D5A] flex items-center justify-center font-bold text-xs shrink-0">
            2
          </div>
          <div>
            <h4 className="font-semibold text-white text-xs">Instant Automated Dispatch</h4>
            <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
              Dispatched directly to your n8n cloud workflow with zero latency.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3.5">
          <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
            3
          </div>
          <div>
            <h4 className="font-semibold text-white text-xs">Track Status &amp; Results</h4>
            <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
              Get an instant confirmation receipt and view your submission history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
