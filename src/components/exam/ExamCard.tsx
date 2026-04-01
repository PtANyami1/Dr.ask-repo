import React from 'react';
import { Info, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { ExamTemplate } from '../../types/exam';
import './ExamCard.css';

interface ExamCardProps {
  template: ExamTemplate;
  examState: Record<string, string>;
  handleValueChange: (id: string, value: string) => void;
  resetExam: (id: string) => void;
  onShowGuide: (title: string, content: string) => void;
  isChanged: boolean;
}

export const ExamCard: React.FC<ExamCardProps> = ({
  template,
  examState,
  handleValueChange,
  resetExam,
  onShowGuide,
  isChanged
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`exam-card ${isChanged ? 'changed' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="exam-card-title">
          {template.name}
          <button 
            onClick={() => onShowGuide(template.name, template.guideText)}
            className="text-slate-300 hover:text-blue-500 transition-colors shrink-0"
            title="가이드 보기"
          >
            <Info size={12} />
          </button>
        </h3>
        {isChanged && (
          <button 
            onClick={() => resetExam(template.id)}
            className="text-slate-400 hover:text-orange-500 transition-colors p-0.5 shrink-0"
            title="초기화"
          >
            <RotateCcw size={12} />
          </button>
        )}
      </div>

      <div>
        {template.type === 'multi-select' && template.subItems ? (
          <div className="flex flex-col gap-1.5">
            {template.subItems.map(subItem => {
              const subItemId = `${template.id}_${subItem.id}`;
              const subItemValue = examState[subItemId] || subItem.defaultValue;
              return (
                <div key={subItem.id} className="flex items-center justify-between gap-1">
                  <span className="subitem-label">{subItem.label}</span>
                  <select
                    value={subItemValue}
                    onChange={(e) => handleValueChange(subItemId, e.target.value)}
                    className="select-input"
                  >
                    {subItem.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        ) : template.type === 'multi-toggle' && template.subItems ? (
          <div className="flex flex-col gap-1.5">
            {template.subItems.map(subItem => {
              const subItemId = `${template.id}_${subItem.id}`;
              const subItemValue = examState[subItemId] || subItem.defaultValue;
              return (
                <div key={subItem.id} className="flex items-center justify-between gap-1">
                  <span className="subitem-label">{subItem.label}</span>
                  <div className="multi-toggle-container">
                    {subItem.options?.map(opt => (
                      <button
                        key={opt}
                        onClick={() => handleValueChange(subItemId, opt)}
                        className={`multi-toggle-btn ${subItemValue === opt ? 'active' : ''}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : template.type === 'rom' && template.subItems ? (
          <div className="flex flex-col gap-1.5">
            {template.subItems.map(subItem => {
              const valId = `${template.id}_${subItem.id}_val`;
              const painId = `${template.id}_${subItem.id}_pain`;
              const val = examState[valId] || '';
              const pain = examState[painId] || '-';
              return (
                <div key={subItem.id} className="flex items-center justify-between gap-1">
                  <span className="subitem-label w-12">{subItem.label}</span>
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleValueChange(valId, e.target.value)}
                      placeholder={subItem.placeholder}
                      className="text-input text-center"
                    />
                    <button
                      onClick={() => handleValueChange(painId, pain === '-' ? '+' : '-')}
                      className={`pain-btn ${pain === '+' ? 'active' : ''}`}
                    >
                      {pain}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : template.type === 'multi-input' && template.subItems ? (
          <div className="flex flex-col gap-1.5">
            {template.subItems.map(subItem => {
              const valId = `${template.id}_${subItem.id}`;
              const val = examState[valId] || '';
              return (
                <div key={subItem.id} className="flex items-center justify-between gap-1">
                  <span className="subitem-label w-12">{subItem.label}</span>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => handleValueChange(valId, e.target.value)}
                    placeholder={subItem.placeholder}
                    className="text-input flex-1 text-center"
                  />
                </div>
              );
            })}
          </div>
        ) : template.type === 'toggle' ? (
          <div className="flex gap-1 w-full">
            {template.options?.map(opt => {
              const currentValue = examState[template.id] || template.defaultValue;
              return (
                <button
                  key={opt}
                  onClick={() => handleValueChange(template.id, opt)}
                  className={`toggle-btn flex-1 py-2 ${currentValue === opt ? 'active' : ''}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              value={examState[template.id] || ''}
              onChange={(e) => handleValueChange(template.id, e.target.value)}
              className={`text-input ${isChanged ? 'changed' : ''}`}
              placeholder={template.placeholder || "결과 입력..."}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};
