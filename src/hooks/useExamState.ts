import { useState, useMemo, useCallback } from 'react';
import { ExamState } from '../types/exam';
import { EXAM_TEMPLATES } from '../data/index';
import { getInitialValues, isModified, formatOutput } from '../utils/examUtils';

function buildInitialState(): ExamState {
  return Object.fromEntries(EXAM_TEMPLATES.map(t => [t.id, getInitialValues(t)]));
}

export function useExamState() {
  const [examState, setExamState] = useState<ExamState>(buildInitialState);
  const [copied, setCopied] = useState(false);
  const [guideInfo, setGuideInfo] = useState<{ title: string; content: string } | null>(null);

  const modifiedCount = useMemo(
    () => EXAM_TEMPLATES.filter(t => isModified(t, examState[t.id] ?? {})).length,
    [examState]
  );

  const handleValueChange = useCallback((templateId: string, key: string, value: string) => {
    setExamState(prev => ({
      ...prev,
      [templateId]: { ...prev[templateId], [key]: value },
    }));
  }, []);

  const resetExam = useCallback((templateId: string) => {
    const template = EXAM_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setExamState(prev => ({ ...prev, [templateId]: getInitialValues(template) }));
    }
  }, []);

  const generateOutput = useCallback((selectedCategories: string[]) => {
    if (selectedCategories.length === 0) return '카테고리를 선택해주세요.';
    return selectedCategories
      .map(cat => {
        const results = EXAM_TEMPLATES
          .filter(t => t.category === cat)
          .map(t => formatOutput(t, examState[t.id] ?? {}))
          .join('\n');
        return `[${cat} Examination]\n${results}`;
      })
      .join('\n\n');
  }, [examState]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  return { examState, modifiedCount, handleValueChange, resetExam, generateOutput, copied, copyToClipboard, guideInfo, setGuideInfo };
}
