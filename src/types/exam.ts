export interface ExamTemplate {
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

export interface ExamState {
  [examId: string]: string; // 변경된 결과값 추적
}
