import React from 'react';
import { 
  Workflow, 
  Send, 
  Database, 
  Mail, 
  MessageSquare, 
  FileSpreadsheet, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Layers,
  Copy,
  Check
} from 'lucide-react';

interface WorkflowGuideProps {
  targetUrl: string;
}

export const WorkflowGuide: React.FC<WorkflowGuideProps> = ({ targetUrl }) => {
  const [copiedUrl, setCopiedUrl] = React.useState(false);

  const copyEndpoint = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#EA4B71]/20 to-indigo-500/20 text-[#FF6D5A] border border-[#EA4B71]/30 text-xs font-medium mb-3">
            <Zap className="w-3.5 h-3.5 fill-[#FF6D5A]" />
            <span>n8n Cloud Automation Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            How Your Web Portal Connects to n8n Cloud
          </h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Every submission through this web portal is routed via our high-speed, CORS-compliant relay directly into your n8n Cloud node on <code className="text-cyan-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded">sandhyarani-781.app.n8n.cloud</code>, orchestrating actions across your productivity ecosystem.
          </p>
        </div>
      </div>

      {/* Interactive Visual Flow Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>End-to-End Execution Flow</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1: User Submission */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative group hover:border-slate-700 transition-colors">
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                <Send className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-semibold uppercase text-indigo-400">Step 1 · Ingestion</span>
              <h4 className="text-sm font-semibold text-white mt-1">Web Portal Form</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Client submits contact inquiry, lead data, or support request with real-time field validation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
              Payload: JSON / URL-Encoded
            </div>
          </div>

          {/* Step 2: Relay & Proxy */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative group hover:border-slate-700 transition-colors">
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#EA4B71]/10 border border-[#EA4B71]/20 text-[#FF6D5A] flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-semibold uppercase text-[#FF6D5A]">Step 2 · Security Relay</span>
              <h4 className="text-sm font-semibold text-white mt-1">Express API Relay</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Normalizes headers, bypasses browser CORS restrictions, and dispatches data to n8n Cloud.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
              Endpoint: /api/n8n/submit
            </div>
          </div>

          {/* Step 3: n8n Workflow Trigger */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative group hover:border-[#EA4B71]/50 transition-colors ring-1 ring-[#EA4B71]/20">
            <div>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#EA4B71] to-[#FF6D5A] text-white flex items-center justify-center mb-3 shadow-md shadow-[#EA4B71]/20">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <span className="text-[10px] font-mono font-semibold uppercase text-amber-400">Step 3 · Execution</span>
              <h4 className="text-sm font-semibold text-white mt-1">n8n Form Trigger</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Captures incoming payload, branches logic, and executes automated business nodes.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-amber-300 truncate">
              sandhyarani-781
            </div>
          </div>

          {/* Step 4: Destination Integrations */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative group hover:border-slate-700 transition-colors">
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-semibold uppercase text-emerald-400">Step 4 · Actions</span>
              <h4 className="text-sm font-semibold text-white mt-1">Multi-App Sync</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Appends row to Google Sheets, sends email notifications, notifies Slack team, or syncs CRM.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Setup Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Testing &amp; Activating Your n8n Workflow</span>
          </h3>
          <ol className="space-y-4 text-xs text-slate-300">
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-[11px] text-white shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-white">Open n8n Workflow Editor:</strong> Log into{' '}
                <a
                  href="https://sandhyarani-781.app.n8n.cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
                >
                  sandhyarani-781.app.n8n.cloud
                </a>{' '}
                and open the workflow containing your Form Trigger node.
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-[11px] text-white shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-white">Click "Execute step" on the Form Trigger:</strong> When testing, n8n waits for an incoming trigger. Once you click "Execute step", submit a form from this portal to send real test data.
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-[11px] text-white shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-white">Toggle Workflow to "Active":</strong> In the top right corner of n8n, flip the workflow toggle switch from <em>Inactive</em> to <em>Active</em>. This automatically enables the <strong>Production URL</strong> (<code className="text-emerald-300 font-mono">/form/...</code>) so submissions are processed 24/7 without needing manual node execution!
              </div>
            </li>
          </ol>
        </div>

        {/* Configuration Reference */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Endpoint Quick Reference</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="font-semibold text-amber-300">Test URL (Draft Testing):</span>
                <span className="text-[10px] font-mono">Single execution</span>
              </div>
              <p className="font-mono text-slate-300 text-[11px] break-all">
                https://sandhyarani-781.app.n8n.cloud/form-test/ef78860c-aab6-4b5b-bf21-a06ac3acd4e1
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="font-semibold text-emerald-300">Production URL (Live):</span>
                <span className="text-[10px] font-mono">Continuous 24/7</span>
              </div>
              <p className="font-mono text-slate-300 text-[11px] break-all">
                https://sandhyarani-781.app.n8n.cloud/form/ef78860c-aab6-4b5b-bf21-a06ac3acd4e1
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={copyEndpoint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-xs"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Active URL</span>
              </button>

              <a
                href="https://sandhyarani-781.app.n8n.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EA4B71] hover:bg-[#d43f63] text-white transition-colors text-xs font-semibold"
              >
                <span>Launch n8n Cloud</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
