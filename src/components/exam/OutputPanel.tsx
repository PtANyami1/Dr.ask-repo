import React from 'react';
import { ClipboardCheck, Copy, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import './OutputPanel.css';

interface OutputPanelProps {
  isPanelOpen: boolean;
  setIsPanelOpen: (isOpen: boolean) => void;
  modifiedCount: number;
  selectedCategoriesLength: number;
  outputText: string;
  copyToClipboard: () => void;
  copied: boolean;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  isPanelOpen,
  setIsPanelOpen,
  modifiedCount,
  selectedCategoriesLength,
  outputText,
  copyToClipboard,
  copied
}) => {
  return (
    <>
      <AnimatePresence>
        {!isPanelOpen && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setIsPanelOpen(true)}
            className="fab-btn group"
          >
            <ClipboardCheck size={24} />
            <span className="hidden md:block font-bold pr-2">EMR Output</span>
            {modifiedCount > 0 && (
              <span className="fab-badge">
                {modifiedCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPanelOpen && (
          <motion.footer 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="output-panel-container z-50 pb-safe"
          >
            <div className="max-w-7xl mx-auto p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <ClipboardCheck size={18} className="text-blue-600" />
                  EMR Output
                  {modifiedCount > 0 && (
                    <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {modifiedCount} modified
                    </span>
                  )}
                </h2>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                <textarea
                  readOnly
                  value={outputText}
                  className="output-textarea border border-slate-800"
                  placeholder="검사 결과가 여기에 표시됩니다..."
                />
                <button
                  onClick={copyToClipboard}
                  disabled={selectedCategoriesLength === 0}
                  className={`copy-btn ${
                    copied 
                      ? 'bg-green-500 text-white shadow-green-200' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 size={20} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={20} />
                      <span>Copy to EMR</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </>
  );
};
