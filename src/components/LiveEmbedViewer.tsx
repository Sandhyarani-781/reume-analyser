import React, { useState } from 'react';
import { 
  Eye, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface LiveEmbedViewerProps {
  targetUrl: string;
}

export const LiveEmbedViewer: React.FC<LiveEmbedViewerProps> = ({ targetUrl }) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const proxyUrl = `/api/n8n/proxy-view?url=${encodeURIComponent(targetUrl)}`;

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Live n8n Form Preview</h2>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Proxied Sandbox
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time preview rendered directly from your n8n cloud server (bypassing X-Frame-Options restrictions via secure reverse proxy).
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Preview</span>
          </button>

          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EA4B71] hover:bg-[#d43f63] text-white shadow-sm transition-colors"
          >
            <span>Open in n8n Cloud</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Guide Banner */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-400 shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="text-slate-300">
            <span className="font-semibold text-white">Understanding n8n Form State: </span>
            If you see <em>"Form Trigger isn't listening yet"</em> inside the preview, your workflow node is currently awaiting your trigger execution.
          </div>
        </div>
        <div className="flex items-center gap-2 text-cyan-400 shrink-0 font-medium">
          <span>Click "Execute step" in n8n</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Iframe Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col min-h-[560px]">
        {/* Browser Mockup Chrome */}
        <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[11px] font-mono text-slate-400 ml-2 hidden sm:inline">
              Secure Proxied Frame: {targetUrl}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CORS &amp; X-Frame Bypassed</span>
            </span>
          </div>
        </div>

        {/* View Frame */}
        <div className="relative flex-1 bg-slate-950 flex flex-col">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 z-10">
              <RefreshCw className="w-6 h-6 text-[#EA4B71] animate-spin mb-2" />
              <p className="text-xs text-slate-300 font-medium">Fetching n8n form view...</p>
            </div>
          )}

          <iframe
            key={iframeKey}
            src={proxyUrl}
            title="n8n Live Preview"
            onLoad={() => setIsLoading(false)}
            className="w-full flex-1 min-h-[540px] border-0 bg-white"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
          />
        </div>
      </div>
    </div>
  );
};
