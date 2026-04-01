import { useState, useEffect, useMemo, useCallback } from 'react';
import { ExamTemplate, ExamState } from '../types/exam';
import { EXAM_TEMPLATES } from '../data/index';

export function useExamState() {
  const [examState, setExamState] = useState<ExamState>({});
  const [copied, setCopied] = useState(false);
  const [guideInfo, setGuideInfo] = useState<{ title: string, content: string } | null>(null);

  // Initialize examState with default values
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

  const handleValueChange = useCallback((id: string, value: string) => {
    setExamState(prev => ({ ...prev, [id]: value }));
  }, []);

  const resetExam = useCallback((id: string) => {
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
  }, [handleValueChange]);

  const generateOutput = useCallback((selectedCategories: string[]) => {
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
  }, [examState]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return {
    examState,
    modifiedCount,
    handleValueChange,
    resetExam,
    generateOutput,
    copied,
    copyToClipboard,
    guideInfo,
    setGuideInfo
  };
}
