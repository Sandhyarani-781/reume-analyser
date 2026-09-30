import React, { useState } from 'react';
import { 
  Globe, 
  ExternalLink, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  SlidersHorizontal, 
  Copy, 
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { EndpointStatus } from '../types/n8n';

interface EndpointBarProps {
  targetUrl: string;
  setTargetUrl: (url: string) => void;
  status: EndpointStatus;
  onRefreshStatus: () => void;
  isDevMode: boolean;
}

export const EndpointBar: React.FC<EndpointBarProps> = ({
  targetUrl,
  setTargetUrl,
  status,
  onRefreshStatus,
  isDevMode,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(targetUrl);
  const [copied, setCopied] = useState(false);
  const [showConfig, setShowConfig] = useState(isDevMode);

  const isTest = targetUrl.includes('/form-test/');
  const isProd = targetUrl.includes('/form/') && !targetUrl.includes('/form-test/');

  const handleSwitchToTest = () => {
    const updated = targetUrl.replace('/form/', '/form-test/');
    setTargetUrl(updated);
    setTempUrl(updated);
  };

  const handleSwitchToProd = () => {
    const updated = targetUrl.replace('/form-test/', '/form/');
    setTargetUrl(updated);
    setTempUrl(updated);
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUrl.trim()) {
      setTargetUrl(tempUrl.trim());
      setIsEditing(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/60 border-b border-slate-800/80 py-2.5 px-4 sm:px-6 lg:px-8 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Friendly Workflow Indicator */}
          <div className="flex items-center gap-2 text-slate-300">
            <span className="flex items-center gap-1.5 font-medium text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Target Workflow:</span>
            </span>
            <span className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              sandhyarani-781.app.n8n.cloud
            </span>

            {/* Test vs Production Mode Switcher */}
            <div className="inline-flex rounded-lg p-0.5 bg-slate-950 border border-slate-800 text-[11px] ml-2">
              <button
                type="button"
                onClick={handleSwitchToTest}
                className={`px-2 py-0.5 rounded font-medium transition-all ${
                  isTest
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Test mode for single executions"
              >
                Test Mode
              </button>
              <button
                type="button"
                onClick={handleSwitchToProd}
                className={`px-2 py-0.5 rounded font-medium transition-all ${
                  isProd
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Production mode for continuous 24/7 processing"
              >
                Live Production
              </button>
            </div>
          </div>

          {/* Quick Expand Toggle for URL Editing */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors py-1 px-1.5"
            >
              <span>{showConfig ? 'Hide Endpoint Details' : 'Configure Endpoint URL'}</span>
              {showConfig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Detailed Configuration Drawer (When toggled or in dev mode) */}
        {(showConfig || isDevMode) && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2 flex-1 min-w-[280px]">
              <span className="text-slate-400 shrink-0 font-medium">Endpoint URL:</span>
              {!isEditing ? (
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-300 max-w-full sm:max-w-md truncate">
                  <span className="truncate">{targetUrl}</span>
                  <button
                    onClick={copyUrl}
                    className="text-slate-400 hover:text-white p-0.5 rounded ml-1"
                    title="Copy URL"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => {
                      setTempUrl(targetUrl);
                      setIsEditing(true);
                    }}
                    className="text-slate-400 hover:text-white p-0.5 rounded ml-0.5"
                    title="Edit custom URL"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveCustom} className="flex items-center gap-2 flex-1 max-w-md">
                  <input
                    type="url"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    className="bg-slate-900 border border-[#EA4B71] rounded px-2 py-1 text-xs font-mono text-white flex-1 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 rounded bg-[#EA4B71] text-white text-xs font-semibold"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>

            <button
              onClick={onRefreshStatus}
              disabled={status.checking}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors shrink-0"
            >
              <RefreshCw className={`w-3 h-3 ${status.checking ? 'animate-spin' : ''}`} />
              <span>{status.checking ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>
        )}

        {/* Friendly Helpful Tip Banner if n8n Form is waiting */}
        {status.isListeningPrompt && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Tip for testing:</strong> Your workflow is ready. In n8n, click <strong>"Execute step"</strong> on your Form Trigger to view live test submissions.
              </span>
            </div>
            <a
              href="https://sandhyarani-781.app.n8n.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-amber-300 hover:text-white underline underline-offset-2 shrink-0 self-end sm:self-auto"
            >
              <span>Open in n8n Cloud</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
