import React, { useState } from 'react';
import { 
  Globe, 
  ExternalLink, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  SlidersHorizontal, 
  Info,
  Copy,
  Check
} from 'lucide-react';
import { EndpointStatus } from '../types/n8n';
import { DEFAULT_N8N_TEST_URL, DEFAULT_N8N_PROD_URL } from '../constants/presets';

interface EndpointBarProps {
  targetUrl: string;
  setTargetUrl: (url: string) => void;
  status: EndpointStatus;
  onRefreshStatus: () => void;
}

export const EndpointBar: React.FC<EndpointBarProps> = ({
  targetUrl,
  setTargetUrl,
  status,
  onRefreshStatus,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(targetUrl);
  const [copied, setCopied] = useState(false);

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
    <div className="bg-slate-900 border-b border-slate-800 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Target URL Badge & Switcher */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-[280px]">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target URL:</span>
            </div>

            {/* Quick Test / Prod mode tabs */}
            <div className="inline-flex rounded-md p-0.5 bg-slate-950 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={handleSwitchToTest}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  isTest
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Use n8n Test Form URL (/form-test/...)"
              >
                Test Mode
              </button>
              <button
                type="button"
                onClick={handleSwitchToProd}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  isProd
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Use n8n Production Form URL (/form/...)"
              >
                Production Mode
              </button>
            </div>

            {/* URL String Display & Quick Actions */}
            {!isEditing ? (
              <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded px-2.5 py-1 text-xs font-mono text-slate-300 max-w-full sm:max-w-md md:max-w-lg truncate">
                <span className="truncate">{targetUrl}</span>
                <button
                  onClick={copyUrl}
                  className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition-colors ml-1"
                  title="Copy URL"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setTempUrl(targetUrl);
                    setIsEditing(true);
                  }}
                  className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition-colors"
                  title="Edit custom endpoint"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveCustom} className="flex items-center gap-2 flex-1 max-w-lg">
                <input
                  type="url"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  className="bg-slate-950 border border-indigo-500/50 rounded px-2.5 py-1 text-xs font-mono text-white flex-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="https://...app.n8n.cloud/form/..."
                  required
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>

          {/* Quick Ping / Refresh */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRefreshStatus}
              disabled={status.checking}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-300 ${status.checking ? 'animate-spin' : ''}`} />
              <span>{status.checking ? 'Checking Endpoint...' : 'Ping Endpoint'}</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Banner if listening prompt is active */}
        {status.isListeningPrompt && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
            <div className="flex items-start sm:items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="font-semibold text-amber-300">n8n Form Trigger Waiting for Execution: </span>
                <span className="text-amber-200/90">
                  Your n8n test node is currently idle. In your n8n workflow editor, click <strong>"Execute step"</strong> (or activate the workflow) so it catches incoming form submissions.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <a
                href="https://sandhyarani-781.app.n8n.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-amber-300 hover:text-amber-100 underline decoration-amber-400/50 underline-offset-2"
              >
                <span>Open n8n Editor</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {status.isReady && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>n8n Endpoint Active &amp; Ready:</strong> Successfully responded with HTTP 200. Submissions will be processed immediately.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
