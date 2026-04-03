import React from 'react';
import { Info, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { ExamTemplate, ExamValues } from '../../types/exam';
import { isModified } from '../../utils/examUtils';
import './ExamCard.css';

interface ExamCardProps {
  template: ExamTemplate;
  values: ExamValues;
  onChange: (key: string, value: string) => void;
  onReset: () => void;
  onShowGuide: () => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({ template, values, onChange, onReset, onShowGuide }) => {
  const isChanged = isModified(template, values);

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
            onClick={onShowGuide}
            className="text-slate-300 hover:text-blue-500 transition-colors shrink-0"
            title="가이드 보기"
          >
            <Info size={12} />
          </button>
        </h3>
        {isChanged && (
          <button
            onClick={onReset}
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
            {template.subItems.map(subItem => (
              <div key={subItem.id} className="flex items-center justify-between gap-1">
                <span className="subitem-label">{subItem.label}</span>
                <select
                  value={values[subItem.id] ?? subItem.defaultValue}
                  onChange={(e) => onChange(subItem.id, e.target.value)}
                  className="select-input"
                >
                  {subItem.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        ) : template.type === 'multi-toggle' && template.subItems ? (
          <div className="flex flex-col gap-1.5">
            {template.subItems.map(subItem => {
              const val = values[subItem.id] ?? subItem.defaultValue;
              return (
                <div key={subItem.id} className="flex items-center justify-between gap-1">
                  <span className="subitem-label">{subItem.label}</span>
                  <div className="multi-toggle-container">
                    {subItem.options?.map(opt => (
                      <button
                        key={opt}
                        onClick={() => onChange(subItem.id, opt)}
                        className={`multi-toggle-btn ${val === opt ? (opt === subItem.defaultValue ? 'active-default' : 'active-abnormal') : ''}`}
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
          <div className="flex flex-col gap-2">
            {template.subItems.map(subItem => {
              const val = values[`${subItem.id}_val`] || '';
              const pain = values[`${subItem.id}_pain`] || '-';
              return (
                <div key={subItem.id} className="flex flex-col gap-0.5">
                  <span className="subitem-label">{subItem.label}</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => onChange(`${subItem.id}_val`, e.target.value)}
                      placeholder={subItem.placeholder}
                      className="text-input text-center flex-1"
                    />
                    <button
                      onClick={() => onChange(`${subItem.id}_pain`, pain === '-' ? '+' : '-')}
                      className={`pain-btn ${pain === '-' ? 'active-default' : 'active-abnormal'}`}
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
            {template.subItems.map(subItem => (
              <div key={subItem.id} className="flex items-center justify-between gap-1">
                <span className="subitem-label w-12">{subItem.label}</span>
                <input
                  type="text"
                  value={values[subItem.id] || ''}
                  onChange={(e) => onChange(subItem.id, e.target.value)}
                  placeholder={subItem.placeholder}
                  className="text-input flex-1 text-center"
                />
              </div>
            ))}
          </div>
        ) : template.type === 'toggle' ? (
          <div className="flex gap-1 w-full">
            {template.options?.map(opt => {
              const current = values['value'] ?? template.defaultValue;
              return (
                <button
                  key={opt}
                  onClick={() => onChange('value', opt)}
                  className={`toggle-btn flex-1 py-2 ${current === opt ? (opt === template.defaultValue ? 'active-default' : 'active-abnormal') : ''}`}
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
              value={values['value'] || ''}
              onChange={(e) => onChange('value', e.target.value)}
              className={`text-input ${isChanged ? 'changed' : ''}`}
              placeholder={template.placeholder || '결과 입력...'}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};
