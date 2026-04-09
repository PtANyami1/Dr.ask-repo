import { useState, useMemo, useCallback } from 'react';

// ─── BST 상태 타입 ───
export interface BstState {
  // 기본
  bst: string;         // 혈당 수치
  insulin: string;     // 인슐린 투여 여부 (-/+)

  // 고혈당 증상 (BST ≥ 200)
  polydipsia: string;    // 다음
  polyuria: string;      // 다뇨
  numbHands: string;     // 수족비증
  fatigue: string;       // 피로감
  itching: string;       // 소양감

  // 저혈당 증상 (인슐린 투여: <80, 미투여: <60)
  dizziness: string;     // 현훈
  palpitation: string;   // 심계
  numbness: string;      // 저림
  pallor: string;        // 창백
  tired: string;         // 피곤
  dyspnea: string;       // 호흡곤란
  sweating: string;      // 한출

  // 공통 (고혈당/저혈당 모두)
  dmMed: string;         // 당뇨약 투여 여부
  meal: string;          // 식사
  snack: string;         // 간식
  fluidIntake: string;   // 음수량
  exercise: string;      // 운동 여부
  exerciseAmount: string; // 운동량 (운동 시에만)
}

const INITIAL_STATE: BstState = {
  bst: '', insulin: '-',
  polydipsia: '-', polyuria: '-', numbHands: '-', fatigue: '-', itching: '-',
  dizziness: '-', palpitation: '-', numbness: '-', pallor: '-', tired: '-', dyspnea: '-', sweating: '-',
  dmMed: '-', meal: '', snack: '', fluidIntake: '', exercise: '-', exerciseAmount: '',
};

// ─── 범위 판정 ───
export type BstRangeStatus = 'normal' | 'high' | 'low' | 'none';

export function checkBstRange(bst: string, insulin: string): BstRangeStatus {
  const v = parseFloat(bst);
  if (isNaN(v)) return 'none';
  if (v >= 200) return 'high';
  const lowThreshold = insulin === '+' ? 80 : 60;
  if (v < lowThreshold) return 'low';
  return 'normal';
}

// ─── Hook ───
export function useBst() {
  const [bstState, setBstState] = useState<BstState>({ ...INITIAL_STATE });

  const updateField = useCallback((field: keyof BstState, value: string) => {
    setBstState(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetAll = useCallback(() => {
    setBstState({ ...INITIAL_STATE });
  }, []);

  // 범위 상태
  const rangeStatus = useMemo((): BstRangeStatus => {
    return checkBstRange(bstState.bst, bstState.insulin);
  }, [bstState.bst, bstState.insulin]);

  const isOutOfRange = rangeStatus === 'high' || rangeStatus === 'low';

  const hasAnyValue = useMemo(() => {
    return bstState.bst !== '';
  }, [bstState.bst]);

  // 출력 텍스트 생성
  const generateOutput = useCallback((): string => {
    if (!hasAnyValue) return '';

    const lines: string[] = [];
    lines.push('[BST]');
    lines.push(` - BST: ${bstState.bst || '_'} mg/dL`);
    lines.push(` - 인슐린 투여: ${bstState.insulin === '+' ? 'Y' : 'N'}`);

    if (rangeStatus === 'high') {
      lines.push(` - [고혈당]`);
      lines.push(` - 다음: ${bstState.polydipsia}`);
      lines.push(` - 다뇨: ${bstState.polyuria}`);
      lines.push(` - 수족비증: ${bstState.numbHands}`);
      lines.push(` - 피로감: ${bstState.fatigue}`);
      lines.push(` - 소양감: ${bstState.itching}`);
    }

    if (rangeStatus === 'low') {
      lines.push(` - [저혈당]`);
      lines.push(` - 현훈: ${bstState.dizziness}`);
      lines.push(` - 심계: ${bstState.palpitation}`);
      lines.push(` - 저림: ${bstState.numbness}`);
      lines.push(` - 창백: ${bstState.pallor}`);
      lines.push(` - 피곤: ${bstState.tired}`);
      lines.push(` - 호흡곤란: ${bstState.dyspnea}`);
      lines.push(` - 한출: ${bstState.sweating}`);
    }

    if (isOutOfRange) {
      lines.push(` - 당뇨약: ${bstState.dmMed === '+' ? 'Y' : 'N'}`);
      lines.push(` - 식사: ${bstState.meal || '미기재'}`);
      lines.push(` - 간식: ${bstState.snack || '미기재'}`);
      lines.push(` - 음수량: ${bstState.fluidIntake || '미기재'}`);
      lines.push(` - 운동: ${bstState.exercise === '+' ? 'Y' : 'N'}`);
      if (bstState.exercise === '+') {
        lines.push(` - 운동량: ${bstState.exerciseAmount || '미기재'}`);
      }
    }

    return lines.join('\n');
  }, [bstState, rangeStatus, isOutOfRange, hasAnyValue]);

  return {
    bstState,
    updateField,
    resetAll,
    rangeStatus,
    isOutOfRange,
    hasAnyValue,
    generateOutput,
  };
}
