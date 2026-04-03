export interface ExamTemplate {
  id: string;
  category: string;
  name: string;
  type: 'toggle' | 'multi-toggle' | 'input' | 'rom' | 'multi-select' | 'multi-input';
  defaultValue?: string;
  options?: string[];
  subItems?: { id: string; label: string; options?: string[]; defaultValue?: string; placeholder?: string }[];
  guideText: string;
  placeholder?: string;
}

export type ExamValues = Record<string, string>;
export type ExamState = Record<string, ExamValues>;
