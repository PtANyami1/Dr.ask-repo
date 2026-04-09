import { useState, useMemo, useCallback } from 'react';

// ─── V/S 상태 타입 ───
export interface VitalSignsState {
  // 기본 V/S
  sbp: string;   // 수축기 혈압
  dbp: string;   // 이완기 혈압
  pr: string;    // 맥박
  rr: string;    // 호흡수
  bt: string;    // 체온

  // 신경학적 검사 (범위 밖일 때)
  mentalGr: string;
  pupilRt: string;
  pupilLt: string;
  babinskiRt: string;
  babinskiLt: string;

  // 증상 (범위 밖일 때)
  headache: string;
  dizziness: string;
  nausea: string;
  vomiting: string;
  chestDiscomfort: string;
  chestPain: string;

  // 생활습관/약물 (범위 밖일 때)
  bpMed: string;
  bpMedTime: string;
  exercise: string;
  stress: string;
  smoking: string;
}

const INITIAL_STATE: VitalSignsState = {
  sbp: '', dbp: '', pr: '', rr: '', bt: '',
  mentalGr: '',
  pupilRt: '0', pupilLt: '0',
  babinskiRt: '-', babinskiLt: '-',
  headache: '-', dizziness: '-', nausea: '-', vomiting: '-',
  chestDiscomfort: '-', chestPain: '-',
  bpMed: '-', bpMedTime: '', exercise: '-', stress: '-', smoking: '-',
};

// ─── 범위 판정 함수 ───
export function checkBpRange(sbp: string, dbp: string): { sbpOut: boolean; dbpOut: boolean } {
  const s = parseFloat(sbp);
  const d = parseFloat(dbp);
  return {
    sbpOut: !isNaN(s) && (s >= 140 || s < 100),
    dbpOut: !isNaN(d) && (d >= 90 || d < 60),
  };
}

export function checkPrRange(pr: string): boolean {
  const v = parseFloat(pr);
  return !isNaN(v) && (v >= 100 || v <= 50);
}

export function checkRrRange(rr: string): boolean {
  const v = parseFloat(rr);
  return !isNaN(v) && (v >= 25 || v < 5);
}

export function checkBtRange(bt: string): boolean {
  const v = parseFloat(bt);
  return !isNaN(v) && (v >= 37.5 || v <= 36.0);
}

// ─── Hook ───
export function useVitalSigns() {
  const [vs, setVs] = useState<VitalSignsState>({ ...INITIAL_STATE });

  const updateField = useCallback((field: keyof VitalSignsState, value: string) => {
    setVs(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetAll = useCallback(() => {
    setVs({ ...INITIAL_STATE });
  }, []);

  // 범위 밖 여부 계산
  const rangeStatus = useMemo(() => {
    const bp = checkBpRange(vs.sbp, vs.dbp);
    const bpOut = bp.sbpOut || bp.dbpOut;
    const prOut = checkPrRange(vs.pr);
    const rrOut = checkRrRange(vs.rr);
    const btOut = checkBtRange(vs.bt);
    const anyOut = bpOut || prOut || rrOut || btOut;

    return { bpOut, sbpOut: bp.sbpOut, dbpOut: bp.dbpOut, prOut, rrOut, btOut, anyOut };
  }, [vs.sbp, vs.dbp, vs.pr, vs.rr, vs.bt]);

  // 값이 입력되었는지 (출력 생성 판단용)
  const hasAnyValue = useMemo(() => {
    return vs.sbp !== '' || vs.dbp !== '' || vs.pr !== '' || vs.rr !== '' || vs.bt !== '';
  }, [vs.sbp, vs.dbp, vs.pr, vs.rr, vs.bt]);

  // 출력 텍스트 생성
  const generateOutput = useCallback((): string => {
    if (!hasAnyValue) return '';

    const lines: string[] = [];
    lines.push('[V/S]');

    // 기본 V/S
    const bpStr = `${vs.sbp || '_'}/${vs.dbp || '_'}`;
    lines.push(` - BP: ${bpStr} mmHg`);
    lines.push(` - PR: ${vs.pr || '_'} 회/분`);
    lines.push(` - RR: ${vs.rr || '_'} 회/분`);
    lines.push(` - BT: ${vs.bt || '_'} ℃`);

    if (rangeStatus.anyOut) {
      // 신경학적 검사
      lines.push(` - Mental: ${vs.mentalGr || 'Gr'}`);
      lines.push(` - Pupil: [ Rt: ${vs.pupilRt}, Lt: ${vs.pupilLt} ]`);
      lines.push(` - Babinski: [ Rt: ${vs.babinskiRt}, Lt: ${vs.babinskiLt} ]`);

      // 증상
      lines.push(` - Headache: ${vs.headache}`);
      lines.push(` - Dizziness: ${vs.dizziness}`);
      lines.push(` - Nausea: ${vs.nausea}`);
      lines.push(` - Vomiting: ${vs.vomiting}`);
      lines.push(` - Chest discomfort: ${vs.chestDiscomfort}`);
      lines.push(` - Chest pain: ${vs.chestPain}`);

      // 생활습관/약물
      lines.push(` - 혈압약 복용: ${vs.bpMed === '+' ? 'Y' : 'N'}`);
      if (vs.bpMed === '+') {
        lines.push(` - 금일 복용 시점: ${vs.bpMedTime || '미기재'}`);
      }
      lines.push(` - 운동: ${vs.exercise === '+' ? 'Y' : 'N'}`);
      lines.push(` - 스트레스: ${vs.stress === '+' ? 'Y' : 'N'}`);
      lines.push(` - 흡연: ${vs.smoking === '+' ? 'Y' : 'N'}`);
    }

    return lines.join('\n');
  }, [vs, rangeStatus, hasAnyValue]);

  return {
    vs,
    updateField,
    resetAll,
    rangeStatus,
    hasAnyValue,
    generateOutput,
  };
}
