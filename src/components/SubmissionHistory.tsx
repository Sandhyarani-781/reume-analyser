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
  Search
} from 'lucide-react';
import { SubmissionLogItem } from '../types/n8n';
import { downloadJsonFile } from '../utils/curlGenerator';

interface SubmissionHistoryProps {
  history: SubmissionLogItem[];
  onClearHistory: () => void;
  onRetry: (item: SubmissionLogItem) => Promise<void>;
}

export const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({
  history,
  onClearHistory,
  onRetry,
}) => {
  const [selectedItem, setSelectedItem] = useState<SubmissionLogItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const payloadStr = JSON.stringify(item.payload).toLowerCase();
    const urlStr = item.targetUrl.toLowerCase();
    return payloadStr.includes(term) || urlStr.includes(term);
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
    downloadJsonFile(`n8n-submission-log-${new Date().toISOString().slice(0, 10)}.json`, history);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Submission History &amp; Audit Log</h2>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {history.length} Entries Logged
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track all automated form submissions dispatched to your n8n workflow with full timestamps and response receipts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            onClick={handleExport}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={onClearHistory}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Log</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      {history.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search submission payloads, emails, names, or target URLs..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* History Table or Empty State */}
      {history.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-500">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No submissions recorded yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Submit a form from the Portal Form tab or dispatch a payload from the Inspector to see live audit logs here.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold">Payload Summary</th>
                  <th className="py-3 px-4 font-semibold">Duration</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredHistory.map((item) => {
                  const summaryText = Object.entries(item.payload)
                    .slice(0, 3)
                    .map(([k, v]) => `${k}: ${typeof v === 'object' ? '...' : String(v)}`)
                    .join(' · ');

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-850/50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        {item.isListeningPrompt ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            <AlertTriangle className="w-3 h-3" />
                            Awaiting Step (404)
                          </span>
                        ) : item.success ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            {item.status || 200} OK
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20">
                            <AlertCircle className="w-3 h-3" />
                            {item.status ? `${item.status} Err` : 'Failed'}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-slate-300 font-mono text-[11px]">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>

                      <td className="py-3 px-4 text-slate-300 max-w-xs md:max-w-md truncate">
                        <span className="text-slate-200 font-medium">
                          {summaryText || 'Empty payload'}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                        {item.durationMs ? `${item.durationMs}ms` : '—'}
                      </td>

                      <td
                        className="py-3 px-4 whitespace-nowrap text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopyPayload(item)}
                            title="Copy payload JSON"
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => handleRetryItem(item)}
                            disabled={retryingId === item.id}
                            title="Re-send submission to n8n"
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                          >
                            <RotateCw
                              className={`w-3.5 h-3.5 ${
                                retryingId === item.id ? 'animate-spin text-cyan-400' : ''
                              }`}
                            />
                          </button>

                          <button
                            onClick={() => setSelectedItem(item)}
                            title="View Full Details"
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">Submission Log Details</h3>
                <span className="text-xs font-mono text-slate-400">
                  {new Date(selectedItem.timestamp).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Target Endpoint
                </label>
                <div className="p-2 rounded bg-slate-950 font-mono text-xs text-slate-300 break-all select-all">
                  {selectedItem.targetUrl}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">HTTP Status</span>
                  <span className="font-semibold text-white mt-1 block">
                    {selectedItem.status || 'Failed'} ({selectedItem.statusText || 'N/A'})
                  </span>
                </div>
                <div className="p-3 rounded bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Round-trip Duration</span>
                  <span className="font-semibold text-white mt-1 block font-mono">
                    {selectedItem.durationMs ? `${selectedItem.durationMs}ms` : 'N/A'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Dispatched Payload (JSON)
                </label>
                <pre className="p-3 rounded bg-slate-950 font-mono text-xs text-cyan-300 max-h-52 overflow-y-auto select-all">
                  {JSON.stringify(selectedItem.payload, null, 2)}
                </pre>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Response Body from n8n
                </label>
                <pre className="p-3 rounded bg-slate-950 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto select-all">
                  {typeof selectedItem.responseData === 'object'
                    ? JSON.stringify(selectedItem.responseData, null, 2)
                    : String(selectedItem.responseData || 'No response data')}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/80">
              <button
                onClick={() => handleCopyPayload(selectedItem)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Payload</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRetryItem(selectedItem)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#EA4B71] hover:bg-[#d43f63] text-xs font-semibold text-white transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Re-send to n8n</span>
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
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
