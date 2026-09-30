import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, X, AlertCircle } from 'lucide-react';

interface FileUploadZoneProps {
  onFileLoaded: (filename: string, content: string, sizeKb: number) => void;
  currentFileName?: string;
  onClearFile?: () => void;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileLoaded,
  currentFileName,
  onClearFile,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(
    currentFileName ? { name: currentFileName, size: 'Attached' } : null
  );
  const [readingError, setReadingError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = (file: File) => {
    setReadingError(null);
    const sizeInKb = Math.round(file.size / 1024);
    const sizeStr = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;

    // Try reading text directly (for .txt, .md, .json, .csv, etc.)
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setFileDetails({ name: file.name, size: sizeStr });
      onFileLoaded(file.name, text || `[Attached Document: ${file.name} (${sizeStr})]`, sizeInKb);
    };
    reader.onerror = () => {
      setFileDetails({ name: file.name, size: sizeStr });
      onFileLoaded(file.name, `[Document attached: ${file.name} (${sizeStr})]`, sizeInKb);
    };

    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      // For PDF / binary documents, read partial text or summarize name
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileDetails(null);
    if (inputRef.current) inputRef.current.value = '';
    if (onClearFile) onClearFile();
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.rtf"
        onChange={handleChange}
        className="hidden"
        id="resume-file-input"
      />

      {fileDetails ? (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-xs sm:text-sm truncate max-w-[200px] sm:max-w-xs">
                  {fileDetails.name}
                </span>
                <span className="text-[11px] font-mono text-emerald-300/80">({fileDetails.size})</span>
              </div>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready to send with your submission</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition-colors"
            title="Remove attached file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#EA4B71] bg-[#EA4B71]/10 scale-[1.01]'
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900/60'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-2 text-slate-400 group-hover:text-white">
            <UploadCloud className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-xs font-semibold text-slate-200">
            Click to upload your resume / document or drag &amp; drop
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Supports PDF, DOCX, TXT (auto-attaches to your workflow submission)
          </p>
          {readingError && (
            <p className="text-[11px] text-rose-400 mt-2 flex items-center justify-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{readingError}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};
