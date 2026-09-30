import React from 'react';
import { 
  Zap, 
  Code2, 
  History, 
  ExternalLink, 
  Workflow, 
  Send,
  Eye,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { EndpointStatus } from '../types/n8n';

interface NavbarProps {
  activeTab: 'portal' | 'inspector' | 'history' | 'preview' | 'guide';
  setActiveTab: (tab: 'portal' | 'inspector' | 'history' | 'preview' | 'guide') => void;
  status: EndpointStatus;
  onRefreshStatus: () => void;
  targetUrl: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  status,
  onRefreshStatus,
  targetUrl,
}) => {
  const isTestMode = targetUrl.includes('/form-test/') || targetUrl.includes('test');

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-tr from-[#EA4B71] to-[#FF6D5A] text-white shadow-md shadow-[#EA4B71]/20">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white tracking-tight text-base sm:text-lg">
                  n8n Connect Hub
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700 hidden sm:inline-block">
                  sandhyarani-781
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Automated Form Relay &amp; Workflow Dispatch
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('portal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'portal'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Send className="w-4 h-4 text-[#FF6D5A]" />
              <span>Portal Form</span>
            </button>

            <button
              onClick={() => setActiveTab('inspector')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'inspector'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Payload &amp; cURL</span>
              <span className="md:hidden">Payload</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <History className="w-4 h-4 text-indigo-400" />
              <span>History</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Live n8n View</span>
              <span className="sm:hidden">View</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'guide'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Workflow className="w-4 h-4 text-cyan-400" />
              <span className="hidden lg:inline">Workflow Guide</span>
              <span className="lg:hidden">Guide</span>
            </button>
          </nav>

          {/* Status & External Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRefreshStatus}
              title="Click to ping n8n endpoint"
              className="flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
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
                      : 'bg-rose-500'
                  }`}
                />
                <span className="hidden sm:inline">
                  {status.checking
                    ? 'Pinging...'
                    : status.isReady
                    ? '200 OK'
                    : status.isListeningPrompt
                    ? 'Awaiting Step'
                    : status.status
                    ? `${status.status}`
                    : 'Unchecked'}
                </span>
              </span>
              <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${status.checking ? 'animate-spin' : ''}`} />
            </button>

            <a
              href="https://sandhyarani-781.app.n8n.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-md hover:bg-slate-800 transition-colors"
            >
              <span>n8n Cloud</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
