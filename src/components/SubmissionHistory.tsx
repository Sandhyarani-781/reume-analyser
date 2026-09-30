import React, { useState } from 'react';
import { 
  History, 
  Trash2, 
  Download, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Eye, 
  X, 
  Copy, 
  Check,
  Search,
  FileText,
  Clock,
  Send
} from 'lucide-react';
import { SubmissionLogItem } from '../types/n8n';
import { downloadJsonFile } from '../utils/curlGenerator';

interface SubmissionHistoryProps {
  history: SubmissionLogItem[];
  onClearHistory: () => void;
  onRetry: (item: SubmissionLogItem) => Promise<void>;
  onGoToSubmit: () => void;
}

export const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({
  history,
  onClearHistory,
  onRetry,
  onGoToSubmit,
}) => {
  const [selectedItem, setSelectedItem] = useState<SubmissionLogItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const payloadStr = JSON.stringify(item.payload).toLowerCase();
    return payloadStr.includes(term);
  });

  const handleCopyPayload = (item: SubmissionLogItem) => {
    navigator.clipboard.writeText(JSON.stringify(item.payload, null, 2));
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRetryItem = async (item: SubmissionLogItem) => {
    setRetryingId(item.id);
    try {
      await onRetry(item);
    } finally {
      setRetryingId(null);
    }
  };

  const handleExport = () => {
    downloadJsonFile(`submissions-${new Date().toISOString().slice(0, 10)}.json`, history);
  };

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + 
        ' · ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      {/* Friendly Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Your Submissions &amp; Activity</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {history.length} {history.length === 1 ? 'submission' : 'submissions'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review past submissions, check delivery receipts, or re-send entries anytime.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          {history.length > 0 && (
            <>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Data</span>
              </button>
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      {history.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, target role, or message..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#EA4B71]"
          />
        </div>
      )}

      {/* History Cards / Table */}
      {history.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400 shadow-md">
            <History className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">No submissions yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
            Ready to test? Fill out the friendly intake form to see your submission activity and delivery confirmation recorded here.
          </p>
          <button
            onClick={onGoToSubmit}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#EA4B71] to-[#FF6D5A] text-white shadow-lg shadow-[#EA4B71]/20 hover:scale-[1.02] transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Go to Submit Form</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const candidateName = item.payload.candidateName || item.payload.fullName || item.payload.clientName || item.payload.requesterName || 'Submission';
            const email = item.payload.email;
            const targetRole = item.payload.targetRole || item.payload.inquiryType || item.payload.issueSummary;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer transition-all hover:bg-slate-850"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 shrink-0">
                    <FileText className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-white">{candidateName}</span>
                      {targetRole && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                          {targetRole}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      {email && <span>{email}</span>}
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                  {/* Status Indicator */}
                  {item.isListeningPrompt ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                      <AlertTriangle className="w-3 h-3" />
                      Awaiting Test Run
                    </span>
                  ) : item.success ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                      <CheckCircle2 className="w-3 h-3" />
                      Delivered ({item.durationMs}ms)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/25">
                      <AlertCircle className="w-3 h-3" />
                      Error
                    </span>
                  )}

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleRetryItem(item)}
                      disabled={retryingId === item.id}
                      title="Re-send submission"
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      <RotateCw
                        className={`w-4 h-4 ${retryingId === item.id ? 'animate-spin text-cyan-400' : ''}`}
                      />
                    </button>
                    <button
                      onClick={() => setSelectedItem(item)}
                      title="View details"
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Submission Summary</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[11px] block">Dispatched At:</span>
                  <span className="font-semibold text-white mt-0.5 block">
                    {formatTimestamp(selectedItem.timestamp)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Execution Duration:</span>
                  <span className="font-semibold text-white mt-0.5 block font-mono">
                    {selectedItem.durationMs ? `${selectedItem.durationMs}ms` : 'Instant'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Submitted Information
                </label>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                  {Object.entries(selectedItem.payload).map(([k, v]) => {
                    if (k.startsWith('_')) return null; // skip internal meta
                    return (
                      <div key={k} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-900 pb-2 last:border-0 last:pb-0">
                        <span className="font-medium text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="text-white font-medium max-w-sm break-words sm:text-right">
                          {typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v || '—')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950">
              <button
                onClick={() => handleCopyPayload(selectedItem)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
              >
                {copiedId === selectedItem.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Summary</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRetryItem(selectedItem)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EA4B71] hover:bg-[#d43f63] text-xs font-bold text-white transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Re-send to Workflow</span>
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
