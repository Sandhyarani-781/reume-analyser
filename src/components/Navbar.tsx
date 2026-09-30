import React from 'react';
import { 
  Zap, 
  Code2, 
  History, 
  Workflow, 
  Send,
  Eye,
  RefreshCw,
  Terminal,
  HelpCircle,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { EndpointStatus } from '../types/n8n';

interface NavbarProps {
  activeTab: 'portal' | 'results' | 'inspector' | 'history' | 'preview' | 'guide';
  setActiveTab: (tab: 'portal' | 'results' | 'inspector' | 'history' | 'preview' | 'guide') => void;
  status: EndpointStatus;
  onRefreshStatus: () => void;
  targetUrl: string;
  isDevMode: boolean;
  setIsDevMode: (val: boolean) => void;
  hasAnalysisResult: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  status,
  onRefreshStatus,
  targetUrl,
  isDevMode,
  setIsDevMode,
  hasAnalysisResult,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#EA4B71] to-[#FF6D5A] text-white shadow-lg shadow-[#EA4B71]/25">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white tracking-tight text-base sm:text-lg">
                  ResumeAI Matcher
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#EA4B71]/15 text-[#FF6D5A] border border-[#EA4B71]/30 hidden sm:inline-block">
                  n8n Agent Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                AI Resume Analyser &amp; Smart Job Match Engine
              </p>
            </div>
          </div>

          {/* Friendly Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => setActiveTab('portal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'portal'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Send className="w-4 h-4 text-[#FF6D5A]" />
              <span>Upload Resume</span>
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all relative ${
                activeTab === 'results'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Matching Jobs</span>
              {hasAnalysisResult && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <History className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Activity</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'guide'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline">How It Works</span>
              <span className="md:hidden">Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'preview'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline">n8n Agent Live</span>
            </button>

            {/* Developer Inspector Tab */}
            {(isDevMode || activeTab === 'inspector') && (
              <button
                onClick={() => setActiveTab('inspector')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'inspector'
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>cURL / JSON</span>
              </button>
            )}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDevMode(!isDevMode)}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
                isDevMode
                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Toggle Developer Tools (cURL, raw JSON payload inspector)"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{isDevMode ? 'Dev: ON' : 'Dev'}</span>
            </button>

            <button
              onClick={onRefreshStatus}
              title="Check n8n Agent status"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    status.checking
                      ? 'bg-amber-400 animate-pulse'
                      : status.isReady
                      ? 'bg-emerald-400'
                      : status.isListeningPrompt
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-emerald-500'
                  }`}
                />
                <span className="hidden sm:inline">
                  {status.checking
                    ? 'Checking...'
                    : status.isReady
                    ? 'Online'
                    : status.isListeningPrompt
                    ? 'Ready for Test'
                    : 'Online'}
                </span>
              </span>
              <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${status.checking ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
