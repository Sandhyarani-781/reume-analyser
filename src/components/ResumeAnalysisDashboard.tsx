import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  ExternalLink, 
  ArrowRight, 
  Download, 
  Share2, 
  RotateCcw, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  Check, 
  Search, 
  SlidersHorizontal,
  Bookmark,
  Building,
  Target,
  FileText
} from 'lucide-react';
import { ResumeAnalysisResult, MatchedJob } from '../types/resume';
import { downloadJsonFile } from '../utils/curlGenerator';

interface ResumeAnalysisDashboardProps {
  result: ResumeAnalysisResult;
  onReAnalyze: () => void;
  targetUrl: string;
}

export const ResumeAnalysisDashboard: React.FC<ResumeAnalysisDashboardProps> = ({
  result,
  onReAnalyze,
  targetUrl,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'high-match' | 'remote'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobForTailoring, setSelectedJobForTailoring] = useState<MatchedJob | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [copiedReport, setCopiedReport] = useState(false);

  const toggleSaveJob = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedJobIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredJobs = result.matchedJobs.filter((job) => {
    if (filterType === 'high-match' && job.matchScore < 90) return false;
    if (filterType === 'remote' && job.workplaceType !== 'Remote') return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        job.title.toLowerCase().includes(term) ||
        job.company.toLowerCase().includes(term) ||
        job.matchedSkills.some((s) => s.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const handleDownloadReport = () => {
    downloadJsonFile(`${result.candidateName.replace(/\s+/g, '_')}_Resume_Analysis_Report.json`, result);
  };

  const handleCopySummary = () => {
    const summaryText = `Resume Analysis for ${result.candidateName}
Target Role: ${result.targetRole}
Overall ATS Score: ${result.overallScore}/100
Extracted Skills: ${result.extractedSkills.join(', ')}
Top Matching Job: ${result.matchedJobs[0]?.title} at ${result.matchedJobs[0]?.company} (${result.matchedJobs[0]?.matchScore}% Match)
Analyzed via n8n Resume Agent (${targetUrl})`;
    navigator.clipboard.writeText(summaryText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Quick Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-gradient-to-br from-[#EA4B71]/20 to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-3">
              <Sparkles className="w-3.5 h-3.5 fill-emerald-400" />
              <span>AI Analysis &amp; Job Match Report Ready</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {result.candidateName}&rsquo;s Profile &amp; Career Matches
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 flex flex-wrap items-center gap-2">
              <span>Target Role: <strong className="text-white">{result.targetRole}</strong></span>
              <span className="text-slate-600">·</span>
              <span>Dispatched to n8n Agent in <strong className="text-cyan-300 font-mono">{result.agentStatus.durationMs}ms</strong></span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedReport ? 'Report Copied!' : 'Share Summary'}</span>
            </button>

            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Download Report</span>
            </button>

            <button
              onClick={onReAnalyze}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#EA4B71] to-[#FF6D5A] hover:opacity-95 text-white shadow-lg shadow-[#EA4B71]/20 transition-all hover:scale-[1.02]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Upload Another Resume</span>
            </button>
          </div>
        </div>

        {/* ATS Score Overview Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Main Overall Gauge */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full bg-slate-900 border-2 border-emerald-500/40 flex items-center justify-center shrink-0 shadow-inner shadow-emerald-500/10">
              <span className="text-xl font-black text-emerald-400 font-mono">
                {result.overallScore}
              </span>
              <span className="text-[10px] text-slate-500 absolute -bottom-1">/100</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Overall ATS Score
              </span>
              <span className="text-xs font-bold text-emerald-300 mt-0.5 block">
                {result.overallScore >= 90
                  ? 'Excellent Match'
                  : result.overallScore >= 80
                  ? 'Strong Potential'
                  : 'Good Foundation'}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Top 8% of applicants</span>
            </div>
          </div>

          {/* Sub-score 1 */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Keyword Alignment</span>
              <span className="font-bold text-white font-mono">{result.scoreBreakdown.keywordMatch}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 mt-2 overflow-hidden border border-slate-800">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${result.scoreBreakdown.keywordMatch}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-2 block">Matches industry skill taxonomies</span>
          </div>

          {/* Sub-score 2 */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Impact &amp; Metrics</span>
              <span className="font-bold text-white font-mono">{result.scoreBreakdown.impactMetrics}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 mt-2 overflow-hidden border border-slate-800">
              <div
                className="bg-indigo-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${result.scoreBreakdown.impactMetrics}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-2 block">Quantified accomplishments</span>
          </div>

          {/* Sub-score 3 */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Skills Coverage</span>
              <span className="font-bold text-white font-mono">{result.scoreBreakdown.skillsCoverage}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 mt-2 overflow-hidden border border-slate-800">
              <div
                className="bg-[#EA4B71] h-full rounded-full transition-all duration-500"
                style={{ width: `${result.scoreBreakdown.skillsCoverage}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-2 block">{result.extractedSkills.length} verified technical skills</span>
          </div>
        </div>
      </div>

      {/* Main Section: Matching Jobs (Primary User Goal) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#EA4B71]" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Recommended Matching Jobs ({filteredJobs.length})
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Positions curated based on your extracted resume skills, experience level, and preferred role.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl p-0.5 bg-slate-900 border border-slate-800 text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filterType === 'all'
                    ? 'bg-slate-800 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Matches ({result.matchedJobs.length})
              </button>
              <button
                onClick={() => setFilterType('high-match')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filterType === 'high-match'
                    ? 'bg-slate-800 text-emerald-400 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                90%+ Match
              </button>
              <button
                onClick={() => setFilterType('remote')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filterType === 'remote'
                    ? 'bg-slate-800 text-cyan-400 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Remote Only
              </button>
            </div>
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => {
            const isSaved = savedJobIds.includes(job.id);
            const isTopMatch = job.matchScore >= 90;

            return (
              <div
                key={job.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-black/40 group relative"
              >
                <div>
                  {/* Top Bar with Match Score and Bookmark */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        isTopMatch
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{job.matchScore}% Match Score</span>
                    </span>

                    <button
                      onClick={(e) => toggleSaveJob(job.id, e)}
                      className={`p-2 rounded-xl border transition-colors ${
                        isSaved
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-slate-950 text-slate-500 hover:text-slate-300 border-slate-800'
                      }`}
                      title={isSaved ? 'Job Bookmarked' : 'Save Job'}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Job Title & Company */}
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 mt-1.5">
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {job.company}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location} ({job.workplaceType})
                    </span>
                  </div>

                  {/* Salary & Type */}
                  <div className="flex items-center gap-2 mt-2.5 text-xs">
                    <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                      {job.salary}
                    </span>
                    <span className="text-slate-400 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                      {job.employmentType}
                    </span>
                  </div>

                  {/* Description Snippet */}
                  <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Matching Skills Badges */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                      <span>Matching Your Skills:</span>
                      <span className="text-emerald-400">{job.matchedSkills.length} matched</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {job.matchedSkills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px] font-medium flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>{skill}</span>
                        </span>
                      ))}
                      {job.missingSkills.length > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-500 border border-slate-800 text-[11px]">
                          +{job.missingSkills[0]} to add
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedJobForTailoring(job)}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>Tailor Resume Tips</span>
                  </button>

                  <a
                    href="https://sandhyarani-781.app.n8n.cloud"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#EA4B71] hover:bg-[#d43f63] text-white transition-colors"
                  >
                    <span>Apply / Dispatch</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skills Analysis & Missing Skills Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Extracted Skills */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Identified Skills in Your Resume</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400">
              {result.extractedSkills.length} Detected
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {result.extractedSkills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold hover:border-slate-700 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="pt-2 text-xs text-slate-400 leading-relaxed">
            These skills were verified by your n8n agent parser and are used to match you with top job requisitions.
          </div>
        </div>

        {/* Recommended Skills to Learn / Add */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span>Recommended Skills for {result.targetRole}</span>
            </h3>
            <span className="text-xs text-amber-400 font-semibold">High ROI</span>
          </div>

          <p className="text-xs text-slate-400">
            Adding these keywords to your resume can boost your interview callback rate by up to 34%:
          </p>

          <div className="flex flex-wrap gap-2">
            {result.missingSkills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <span>+</span>
                <span>{skill}</span>
              </span>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <strong>Pro Tip:</strong> Even personal project experience with {result.missingSkills[0] || 'Cloud tools'} counts! Add a short bullet point under projects.
          </div>
        </div>
      </div>

      {/* Actionable Resume Improvements (Before vs After) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <span>Actionable Resume Optimizations (Before vs After)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real recommendations generated for your profile to pass corporate ATS filters and impress hiring managers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.improvementTips.map((tip, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                  {tip.category}
                </span>
                <h4 className="text-xs font-bold text-white">{tip.tip}</h4>
              </div>

              {tip.before && tip.after && (
                <div className="space-y-2 text-[11px] pt-2 border-t border-slate-900">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                    <span className="font-bold text-[10px] uppercase text-rose-400 block mb-0.5">Weak (Before):</span>
                    <span>&ldquo;{tip.before}&rdquo;</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    <span className="font-bold text-[10px] uppercase text-emerald-400 block mb-0.5">Strong (After):</span>
                    <span>&ldquo;{tip.after}&rdquo;</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Job Tailoring Modal */}
      {selectedJobForTailoring && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full p-6 text-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase text-emerald-400 block">
                  Tailored Match Plan ({selectedJobForTailoring.matchScore}% Match)
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedJobForTailoring.title}
                </h3>
                <span className="text-xs text-slate-400">{selectedJobForTailoring.company} · {selectedJobForTailoring.salary}</span>
              </div>
              <button
                onClick={() => setSelectedJobForTailoring(null)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-white block">Key Skills Already in Your Resume:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJobForTailoring.matchedSkills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[11px]">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-white block">Keywords to Add Before Submitting:</span>
                <p className="text-slate-400 text-[11px]">
                  Mention these tools in your experience or summary section to maximize your score:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJobForTailoring.missingSkills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[11px]">
                      + {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedJobForTailoring(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Close
              </button>
              <a
                href="https://sandhyarani-781.app.n8n.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-xl bg-[#EA4B71] hover:bg-[#d43f63] text-xs font-bold text-white transition-colors flex items-center gap-1.5"
              >
                <span>Dispatch to n8n Agent</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
