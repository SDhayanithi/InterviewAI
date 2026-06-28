import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, FileCheck, FileSpreadsheet, Paperclip, Download,
  Plus, Check, Trash2, ArrowUpRight, Search, UploadCloud, Info
} from 'lucide-react';
import { mockInterviews } from '../utils/mockData';
import type { DocumentFile } from '../types';
import { useToast } from '../context/ToastContext';

export const CandidateDocuments: React.FC = () => {
  const { showToast } = useToast();
  
  const [documents, setDocuments] = useState<DocumentFile[]>(() => {
    // Gather all candidate documents
    return mockInterviews[0].documents;
  });

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      uploadMockFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadMockFile(e.target.files[0]);
    }
  };

  const uploadMockFile = (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    let fileType: any = 'pdf';
    if (['xlsx', 'xls', 'csv'].includes(fileExtension || '')) fileType = 'xlsx';
    else if (['docx', 'doc'].includes(fileExtension || '')) fileType = 'docx';

    const newDoc: DocumentFile = {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: fileType,
      url: '#'
    };

    setDocuments(prev => [...prev, newDoc]);
    showToast(`File "${file.name}" uploaded successfully!`, 'success');
  };

  const handleRemove = (name: string) => {
    setDocuments(prev => prev.filter(d => d.name !== name));
    showToast(`File "${name}" removed`, 'info');
  };

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Documents Repository
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Access organizational job requirements, upload your resumes, and preview checklists.
        </p>
      </div>

      {/* Grid: Uploader and List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Upload Block (1/3 col) */}
        <div className="md:col-span-1 space-y-4">
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-[24px] p-6 text-center transition-all flex flex-col items-center justify-center min-h-[260px] relative ${
              dragActive 
                ? 'border-primary bg-primary/5 scale-98' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
            }`}
          >
            <UploadCloud className="w-12 h-12 text-slate-400 mb-3 animate-pulse" />
            <h3 className="font-extrabold text-xs text-slate-850 dark:text-slate-200">Drag & Drop Resume</h3>
            <p className="text-[10px] text-slate-450 mt-1 mb-4 leading-relaxed">
              PDF, Word or excel sheets up to 10MB.
            </p>
            
            <input 
              type="file" 
              id="file-input" 
              className="hidden" 
              onChange={handleFileInput}
            />
            <label 
              htmlFor="file-input"
              className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl shadow-md shadow-primary/20 cursor-pointer hover:scale-102 transition-transform"
            >
              Browse Files
            </label>
          </div>

          <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-[10px] text-slate-500 leading-relaxed flex gap-2">
            <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>Uploaded documents are automatically scanned by our AI tool and shared with panel reviewers.</span>
          </div>
        </div>

        {/* Documents list (2/3 col) */}
        <div className="md:col-span-2 glass-effect p-6 rounded-[24px] border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4">Repository Files</h3>

          <div className="space-y-3.5">
            {documents.map((doc, idx) => {
              const icons: Record<string, React.ReactNode> = {
                pdf: <FileText className="w-8 h-8 text-rose-500" />,
                docx: <FileCheck className="w-8 h-8 text-blue-500" />,
                xlsx: <FileSpreadsheet className="w-8 h-8 text-emerald-500" />
              };

              return (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {icons[doc.type] || <FileText className="w-8 h-8 text-slate-400" />}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">{doc.name}</h4>
                      <p className="text-[10px] text-slate-450 mt-0.5">{doc.size} • {doc.type.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => showToast(`Downloading ${doc.name}...`, 'success')}
                      className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-250/60 dark:border-slate-800 text-slate-500 hover:text-primary transition-colors cursor-pointer"
                      title="Download File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(doc.name)}
                      className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-250/60 dark:border-slate-800 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Delete File"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
