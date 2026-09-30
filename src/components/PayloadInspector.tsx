import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Send, 
  Terminal, 
  Download, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  FileCode,
  Zap
} from 'lucide-react';
import { generateCurlCommand, downloadJsonFile } from '../utils/curlGenerator';

interface PayloadInspectorProps {
  formData: Record<string, any>;
  targetUrl: string;
  onSubmitCustomPayload: (payload: Record<string, any>, format: 'json' | 'form-urlencoded') => Promise<any>;
}

export const PayloadInspector: React.FC<PayloadInspectorProps> = ({
  formData,
  targetUrl,
  onSubmitCustomPayload,
}) => {
  const [format, setFormat] = useState<'json' | 'form-urlencoded'>('json');
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [customJsonText, setCustomJsonText] = useState(JSON.stringify(formData, null, 2));
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Sync when formData updates if not actively in custom mode
  React.useEffect(() => {
    if (!isCustomMode) {
      setCustomJsonText(JSON.stringify(formData, null, 2));
    }
  }, [formData, isCustomMode]);

  const activePayload = React.useMemo(() => {
    if (!isCustomMode) return formData;
    try {
      return JSON.parse(customJsonText);
    } catch {
      return formData;
    }
  }, [isCustomMode, customJsonText, formData]);

  const curlCommand = generateCurlCommand(targetUrl, activePayload, format);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(activePayload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleDownload = () => {
    downloadJsonFile('n8n-payload.json', activePayload);
  };

  const handleSendCustom = async () => {
    let parsed: any;
    try {
      parsed = JSON.parse(customJsonText);
      setJsonError(null);
    } catch (e: any) {
      setJsonError(`Invalid JSON format: ${e.message}`);
      return;
    }

    setIsSending(true);
    try {
      const res = await onSubmitCustomPayload(parsed, format);
      setTestResult(res);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Payload Inspector &amp; Webhook Simulator</h2>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Developer Tools
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate submissions, inspect exact JSON/cURL syntax, and test payloads directly into your n8n workflow.
          </p>
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <div className="inline-flex rounded-lg p-1 bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setFormat('json')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                format === 'json'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              JSON (application/json)
            </button>
            <button
              onClick={() => setFormat('form-urlencoded')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                format === 'form-urlencoded'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              x-www-form-urlencoded
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: JSON Viewer & Custom Editor */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-200">
                {isCustomMode ? 'Manual JSON Editor' : 'Live Form Payload (Synced)'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!isCustomMode) {
                    setCustomJsonText(JSON.stringify(formData, null, 2));
                  }
                  setIsCustomMode(!isCustomMode);
                }}
                className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                  isCustomMode
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {isCustomMode ? 'Locked: Custom Edit' : 'Edit Manually'}
              </button>
              <button
                onClick={handleCopyJson}
                className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Copy JSON"
              >
                {copiedJson ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Download JSON File"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col bg-slate-950/60 font-mono text-xs">
            {isCustomMode ? (
              <div className="flex-1 flex flex-col">
                <textarea
                  value={customJsonText}
                  onChange={(e) => {
                    setCustomJsonText(e.target.value);
                    try {
                      JSON.parse(e.target.value);
                      setJsonError(null);
                    } catch (err: any) {
                      setJsonError(err.message);
                    }
                  }}
                  rows={14}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-3 text-cyan-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none flex-1"
                />
                {jsonError && (
                  <p className="text-rose-400 text-[11px] mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{jsonError}</span>
                  </p>
                )}
              </div>
            ) : (
              <pre className="p-3 bg-slate-900 rounded border border-slate-800 text-cyan-300 overflow-x-auto max-h-[360px] leading-relaxed select-all">
                {JSON.stringify(formData, null, 2)}
              </pre>
            )}

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-sans">
                {Object.keys(activePayload).length} keys included in payload
              </span>
              <button
                onClick={handleSendCustom}
                disabled={isSending || !!jsonError}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#EA4B71] to-[#FF6D5A] hover:opacity-95 text-white shadow-sm transition-all disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isSending ? 'Dispatching to n8n...' : 'Dispatch Raw Payload'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: cURL Command & Execution Feedback */}
        <div className="space-y-6">
          {/* cURL Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200">Terminal cURL Command</span>
              </div>
              <button
                onClick={handleCopyCurl}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                {copiedCurl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy cURL</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 bg-slate-950/60 font-mono text-xs">
              <pre className="p-3 bg-slate-900 rounded border border-slate-800 text-emerald-300 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed select-all">
                {curlCommand}
              </pre>
              <p className="text-[11px] text-slate-400 font-sans mt-2">
                Paste directly into your bash terminal or Postman to test external delivery.
              </p>
            </div>
          </div>

          {/* Test Dispatch Result (if sent from raw editor) */}
          {testResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  {testResult.isListeningPrompt ? (
                    <span className="text-amber-400 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      Status: 404 (Awaiting n8n "Execute step")
                    </span>
                  ) : testResult.success ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Status: {testResult.status} OK
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      Status: {testResult.status || 'Failed'}
                    </span>
                  )}
                </div>
                {testResult.durationMs && (
                  <span className="text-[11px] font-mono text-slate-400">
                    {testResult.durationMs}ms
                  </span>
                )}
              </div>

              {testResult.isListeningPrompt ? (
                <div className="text-xs text-amber-200/90 bg-amber-500/10 border border-amber-500/20 rounded p-3">
                  <p>
                    <strong>n8n Received Request:</strong> However, the Form Trigger is in draft/test mode. To process this payload in n8n:
                  </p>
                  <ol className="list-decimal ml-4 mt-1.5 space-y-0.5 text-[11px]">
                    <li>Switch to your n8n browser tab at <strong>sandhyarani-781.app.n8n.cloud</strong></li>
                    <li>Click the <strong>"Execute step"</strong> button on your Form Trigger node</li>
                    <li>Click <strong>"Dispatch Raw Payload"</strong> again to capture the schema!</li>
                  </ol>
                </div>
              ) : (
                <pre className="p-3 bg-slate-950 rounded text-xs font-mono text-slate-300 max-h-48 overflow-y-auto">
                  {typeof testResult.data === 'object'
                    ? JSON.stringify(testResult.data, null, 2)
                    : testResult.rawSnippet || 'No response body'}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
