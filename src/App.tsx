/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ClipboardCheck, 
  Copy, 
  Info, 
  ChevronRight, 
  ChevronDown,
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Stethoscope,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface ExamTemplate {
  id: string;          // 고유 식별자 (예: 'c_spurling')
  category: string;    // 분류 (예: 'Neck', 'Back')
  name: string;        // 검사명 (예: 'Spurling Test')
  type: 'toggle' | 'multi-toggle' | 'input' | 'rom' | 'multi-select' | 'multi-input'; // 입력 방식
  defaultValue?: string;// 기본(정상) 결과 텍스트 (예: 'Negative (-)')
  options?: string[];  // 토글 시 선택 가능한 값들
  subItems?: { id: string; label: string; options?: string[]; defaultValue?: string; placeholder?: string }[]; // multi-toggle 하위 항목
  guideText: string;   // 가이드 텍스트
  placeholder?: string; // input 타입의 placeholder
}

interface ExamState {
  [examId: string]: string; // 변경된 결과값 추적
}

import EXAM_TEMPLATES_DATA from './data/examTemplates.json';

// --- Constants (Dummy Data) ---

const EXAM_TEMPLATES: ExamTemplate[] = EXAM_TEMPLATES_DATA as ExamTemplate[];

const CATEGORIES = Array.from(new Set(EXAM_TEMPLATES.map(t => t.category)));

// --- Components ---

const GuideModal = ({ isOpen, onClose, title, content }: { isOpen: boolean, onClose: () => void, title: string, content: string }) => {
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

export default function App() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['CVA']);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const [isOutputPanelOpen, setIsOutputPanelOpen] = useState(false);
  const [examState, setExamState] = useState<ExamState>({});
  const [copied, setCopied] = useState(false);
  const [guideInfo, setGuideInfo] = useState<{ title: string, content: string } | null>(null);

  // Initialize examState with default values for all templates
  useEffect(() => {
    const initialState: ExamState = {};
    EXAM_TEMPLATES.forEach(template => {
      if ((template.type === 'multi-toggle' || template.type === 'multi-select') && template.subItems) {
        template.subItems.forEach(sub => {
          if (sub.defaultValue !== undefined) {
            initialState[`${template.id}_${sub.id}`] = sub.defaultValue;
          }
        });
      } else if ((template.type === 'rom' || template.type === 'multi-input') && template.subItems) {
        // rom, multi-input 타입은 초기 상태를 비워둡니다 (placeholder 사용)
      } else if (template.defaultValue !== undefined) {
        initialState[template.id] = template.defaultValue;
      }
    });
    setExamState(initialState);
  }, []);

  const modifiedCount = useMemo(() => {
    return EXAM_TEMPLATES.filter(template => {
      if ((template.type === 'multi-toggle' || template.type === 'multi-select') && template.subItems) {
        return template.subItems.some(sub => {
          const val = examState[`${template.id}_${sub.id}`];
          return val !== undefined && val !== sub.defaultValue;
        });
      } else if (template.type === 'rom' && template.subItems) {
        return template.subItems.some(sub => {
          const val = examState[`${template.id}_${sub.id}_val`];
          const pain = examState[`${template.id}_${sub.id}_pain`];
          return (val !== undefined && val !== '') || (pain !== undefined && pain !== '-');
        });
      } else if (template.type === 'multi-input' && template.subItems) {
        return template.subItems.some(sub => {
          const val = examState[`${template.id}_${sub.id}`];
          return val !== undefined && val !== '';
        });
      }
      const currentValue = examState[template.id];
      return currentValue !== undefined && currentValue !== template.defaultValue && currentValue !== '';
    }).length;
  }, [examState]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleValueChange = (id: string, value: string) => {
    setExamState(prev => ({ ...prev, [id]: value }));
  };

  const resetExam = (id: string) => {
    const template = EXAM_TEMPLATES.find(t => t.id === id);
    if (template) {
      if ((template.type === 'multi-toggle' || template.type === 'multi-select') && template.subItems) {
        const resetState: ExamState = {};
        template.subItems.forEach(sub => {
          if (sub.defaultValue !== undefined) {
            resetState[`${template.id}_${sub.id}`] = sub.defaultValue;
          }
        });
        setExamState(prev => ({ ...prev, ...resetState }));
      } else if (template.type === 'rom' && template.subItems) {
        const resetState: ExamState = {};
        template.subItems.forEach(sub => {
          resetState[`${template.id}_${sub.id}_val`] = '';
          resetState[`${template.id}_${sub.id}_pain`] = '-';
        });
        setExamState(prev => ({ ...prev, ...resetState }));
      } else if (template.type === 'multi-input' && template.subItems) {
        const resetState: ExamState = {};
        template.subItems.forEach(sub => {
          resetState[`${template.id}_${sub.id}`] = '';
        });
        setExamState(prev => ({ ...prev, ...resetState }));
      } else {
        handleValueChange(id, template.defaultValue || '');
      }
    }
  };

  const filteredTemplates = useMemo(() => {
    return EXAM_TEMPLATES.filter(t => selectedCategories.includes(t.category));
  }, [selectedCategories]);

  const outputText = useMemo(() => {
    if (selectedCategories.length === 0) return "카테고리를 선택해주세요.";
    
    return selectedCategories.map(cat => {
      const catExams = EXAM_TEMPLATES.filter(t => t.category === cat);
      const results = catExams.map(t => {
        if ((t.type === 'multi-toggle' || t.type === 'multi-select') && t.subItems) {
          const subResults = t.subItems.map(sub => `${sub.label}: ${examState[`${t.id}_${sub.id}`] || sub.defaultValue}`).join(', ');
          return ` - ${t.name}: [ ${subResults} ]`;
        } else if (t.type === 'rom' && t.subItems) {
          const subResults = t.subItems.map(sub => {
            const val = examState[`${t.id}_${sub.id}_val`] || sub.placeholder || '';
            const pain = examState[`${t.id}_${sub.id}_pain`] || '-';
            return `${sub.label}: ${val}(${pain})`;
          }).join(', ');
          return ` - ${t.name}: [ ${subResults} ]`;
        } else if (t.type === 'multi-input' && t.subItems) {
          const subResults = t.subItems.map(sub => {
            const val = examState[`${t.id}_${sub.id}`] || sub.placeholder || '';
            return `${sub.label}: ${val}`;
          }).join(', ');
          return ` - ${t.name}: [ ${subResults} ]`;
        } else if (t.type === 'input') {
          const val = examState[t.id] || t.placeholder || t.defaultValue || '';
          return ` - ${t.name}: ${val}`;
        }
        return ` - ${t.name}: ${examState[t.id] || t.defaultValue}`;
      }).join('\n');
      return `[${cat} Examination]\n${results}`;
    }).join('\n\n');
  }, [selectedCategories, examState]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center h-14 gap-4 md:gap-8">
          <h1 className="text-lg font-bold tracking-tight text-slate-800 flex-shrink-0">문진</h1>
          <nav className="flex items-center gap-2 md:gap-4 h-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-1">
            <button className="px-2 md:px-3 h-full flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 border-b-2 border-transparent whitespace-nowrap transition-colors">CC/PI</button>
            <button className="px-2 md:px-3 h-full flex items-center text-sm font-bold text-blue-600 border-b-2 border-blue-600 whitespace-nowrap transition-colors">PE</button>
            <button className="px-2 md:px-3 h-full flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 border-b-2 border-transparent whitespace-nowrap transition-colors">Assessment</button>
            <button className="px-2 md:px-3 h-full flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 border-b-2 border-transparent whitespace-nowrap transition-colors">Plan</button>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-0 md:gap-6 p-4 md:p-8 pt-0 md:pt-8">
        {/* Mobile Category Dropdown */}
        <div className="md:hidden sticky top-[56px] z-20 bg-slate-50 pt-3 pb-2 -mx-4 px-4 border-b border-slate-200/50 shadow-sm mb-4">
          <button
            onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
            className="w-full flex items-center justify-between bg-white border border-slate-200 p-3 rounded-xl shadow-sm"
          >
            <span className="font-bold text-sm text-slate-700">
              Categories <span className="text-blue-600">({selectedCategories.length})</span>
            </span>
            <ChevronDown size={18} className={`text-slate-400 transform transition-transform duration-300 ${isMobileCategoryOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {isMobileCategoryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pt-3 pb-1">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                        selectedCategories.includes(cat)
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <span>{cat}</span>
                      {selectedCategories.includes(cat) && <CheckCircle2 size={14} className="opacity-80" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-56 lg:w-64 flex-shrink-0 sticky top-24 z-20 self-start">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</h2>
              {selectedCategories.length > 0 && (
                <button 
                  onClick={() => setSelectedCategories([])}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Clear all
                </button>
              )}
            </div>
            
            {/* Category List */}
            <div className="flex flex-col gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border border-transparent ${
                    selectedCategories.includes(cat)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategories.includes(cat) && (
                    <CheckCircle2 size={16} className="opacity-70" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {selectedCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 md:py-20 text-slate-400 bg-white rounded-2xl md:rounded-3xl border border-slate-200 border-dashed">
              <AlertCircle size={40} className="mb-3 opacity-20" />
              <p className="text-base md:text-lg font-medium">기록할 부위를 선택해주세요.</p>
              <p className="text-xs md:text-sm mt-2">메뉴에서 카테고리를 선택하세요.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {selectedCategories.map(category => {
                const categoryTemplates = filteredTemplates.filter(t => t.category === category);
                if (categoryTemplates.length === 0) return null;

                return (
                  <div key={category} className="bg-slate-50/50 rounded-2xl p-3 md:p-4 border border-slate-100">
                    <h2 className="text-base md:text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
                      {category}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                      <AnimatePresence mode="popLayout">
                        {categoryTemplates.map((template) => {
                          let isChanged = false;
                if ((template.type === 'multi-toggle' || template.type === 'multi-select') && template.subItems) {
                  isChanged = template.subItems.some(sub => examState[`${template.id}_${sub.id}`] !== sub.defaultValue);
                } else if (template.type === 'rom' && template.subItems) {
                  isChanged = template.subItems.some(sub => {
                    const val = examState[`${template.id}_${sub.id}_val`];
                    const pain = examState[`${template.id}_${sub.id}_pain`];
                    return (val !== undefined && val !== '') || (pain !== undefined && pain !== '-');
                  });
                } else if (template.type === 'multi-input' && template.subItems) {
                  isChanged = template.subItems.some(sub => {
                    const val = examState[`${template.id}_${sub.id}`];
                    return val !== undefined && val !== '';
                  });
                } else {
                  const val = examState[template.id];
                  isChanged = val !== undefined && val !== template.defaultValue && val !== '';
                }

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={template.id}
                    className={`bg-white rounded-lg p-2.5 border transition-all duration-200 flex flex-col ${
                      isChanged ? 'border-blue-400 ring-1 ring-blue-100 shadow-sm' : 'border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1 leading-tight">
                        {template.name}
                        <button 
                          onClick={() => setGuideInfo({ title: template.name, content: template.guideText })}
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

                    <div className="mt-auto">
                      {template.type === 'multi-select' && template.subItems ? (
                        <div className="flex flex-col gap-1.5">
                          {template.subItems.map(subItem => {
                            const subItemId = `${template.id}_${subItem.id}`;
                            const subItemValue = examState[subItemId] || subItem.defaultValue;
                            return (
                              <div key={subItem.id} className="flex items-center justify-between gap-1">
                                <span className="text-[10px] text-slate-600 font-medium truncate">{subItem.label}</span>
                                <select
                                  value={subItemValue}
                                  onChange={(e) => handleValueChange(subItemId, e.target.value)}
                                  className="px-2 py-1 rounded border border-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500/20 bg-slate-50 text-slate-700"
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
                                <span className="text-[10px] text-slate-600 font-medium truncate">{subItem.label}</span>
                                <div className="flex rounded overflow-hidden border border-slate-200 shrink-0">
                                  {subItem.options?.map(opt => (
                                    <button
                                      key={opt}
                                      onClick={() => handleValueChange(subItemId, opt)}
                                      className={`px-2 py-1 text-[10px] font-medium transition-all ${
                                        subItemValue === opt
                                          ? 'bg-blue-600 text-white'
                                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-r border-slate-200 last:border-r-0'
                                      }`}
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
                                <span className="text-[10px] text-slate-600 font-medium truncate w-12">{subItem.label}</span>
                                <div className="flex items-center gap-1 flex-1">
                                  <input
                                    type="text"
                                    value={val}
                                    onChange={(e) => handleValueChange(valId, e.target.value)}
                                    placeholder={subItem.placeholder}
                                    className="w-full px-2 py-1 rounded border border-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500/20 bg-slate-50 text-center"
                                  />
                                  <button
                                    onClick={() => handleValueChange(painId, pain === '-' ? '+' : '-')}
                                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all shrink-0 w-8 ${
                                      pain === '+' ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-slate-50 text-slate-400 border border-slate-200'
                                    }`}
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
                                <span className="text-[10px] text-slate-600 font-medium truncate w-12">{subItem.label}</span>
                                <input
                                  type="text"
                                  value={val}
                                  onChange={(e) => handleValueChange(valId, e.target.value)}
                                  placeholder={subItem.placeholder}
                                  className="w-full px-2 py-1 rounded border border-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500/20 bg-slate-50 text-center flex-1"
                                />
                              </div>
                            );
                          })}
                        </div>
                      ) : template.type === 'toggle' ? (
                        <div className="flex flex-wrap gap-1">
                          {template.options?.map(opt => {
                            const currentValue = examState[template.id] || template.defaultValue;
                            return (
                              <button
                                key={opt}
                                onClick={() => handleValueChange(template.id, opt)}
                                className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                                  currentValue === opt
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
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
                            className={`w-full px-2 py-1.5 rounded border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all ${
                              isChanged ? 'border-blue-300 bg-blue-50/30' : 'border-slate-200 bg-slate-50'
                            }`}
                            placeholder={template.placeholder || "결과 입력..."}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Floating Action Button (when panel is closed) */}
      <AnimatePresence>
        {!isOutputPanelOpen && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setIsOutputPanelOpen(true)}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-blue-600 text-white p-4 rounded-full shadow-xl z-40 hover:bg-blue-700 transition-colors flex items-center gap-2 group"
          >
            <ClipboardCheck size={24} />
            <span className="hidden md:block font-bold pr-2">EMR Output</span>
            {modifiedCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {modifiedCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom Output Panel */}
      <AnimatePresence>
        {isOutputPanelOpen && (
          <motion.footer 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.15)] z-50 pb-safe"
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
                  onClick={() => setIsOutputPanelOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                <textarea
                  readOnly
                  value={outputText}
                  className="flex-1 h-24 md:h-32 p-3 md:p-4 bg-slate-900 text-slate-100 rounded-xl text-xs md:text-sm font-mono resize-none focus:outline-none border border-slate-800"
                  placeholder="검사 결과가 여기에 표시됩니다..."
                />
                <button
                  onClick={copyToClipboard}
                  disabled={selectedCategories.length === 0}
                  className={`flex items-center justify-center gap-2 px-6 py-3 md:py-0 rounded-xl font-bold transition-all md:w-48 ${
                    copied 
                      ? 'bg-green-500 text-white shadow-green-200' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                  } shadow-lg disabled:opacity-50 disabled:shadow-none`}
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

      {/* Guide Modal */}
      <GuideModal 
        isOpen={!!guideInfo} 
        onClose={() => setGuideInfo(null)}
        title={guideInfo?.title || ''}
        content={guideInfo?.content || ''}
      />
    </div>
  );
}
