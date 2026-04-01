import React from 'react';
import { Info } from 'lucide-react';
import { motion } from 'motion/react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-blue-100"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-4 text-blue-600">
          <Info size={20} />
          <h3 className="font-bold text-lg">{title} 가이드</h3>
        </div>
        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{content}</p>
        <button 
          onClick={onClose}
          className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          확인
        </button>
      </motion.div>
    </div>
  );
};
