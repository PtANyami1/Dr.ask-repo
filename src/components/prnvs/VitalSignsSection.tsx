import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VitalSignsState } from '../../hooks/useVitalSigns';

interface VitalSignsSectionProps {
  vs: VitalSignsState;
  updateField: (field: keyof VitalSignsState, value: string) => void;
  rangeStatus: {
    bpOut: boolean; sbpOut: boolean; dbpOut: boolean;
    prOut: boolean; rrOut: boolean; btOut: boolean;
    anyOut: boolean;
  };
}

// ─── 토글 버튼 ───
const ToggleButton: React.FC<{
  value: string;
  defaultVal: string;
  options: [string, string];
  onChange: (val: string) => void;
  size?: 'sm' | 'md';
}> = ({ value, defaultVal, options, onChange, size = 'sm' }) => (
  <div className="vs-toggle-container">
    {options.map(opt => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`vs-toggle-btn ${size === 'md' ? 'vs-toggle-md' : ''} ${
          value === opt
            ? opt === defaultVal ? 'active-default' : 'active-abnormal'
            : ''
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

// ─── YN 토글 (혈압약/운동/스트레스/흡연) ───
const YNToggle: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
}> = ({ label, value, onChange }) => (
  <div className="vs-yn-row">
    <span className="vs-field-label">{label}</span>
    <ToggleButton value={value} defaultVal="-" options={['-', '+']} onChange={onChange} />
  </div>
);

// ─── 증상 토글 행 ───
const SymptomToggle: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
}> = ({ label, value, onChange }) => (
  <div className="vs-symptom-item">
    <span className="vs-symptom-label">{label}</span>
    <ToggleButton value={value} defaultVal="-" options={['-', '+']} onChange={onChange} />
  </div>
);

export const VitalSignsSection: React.FC<VitalSignsSectionProps> = ({
  vs, updateField, rangeStatus
}) => {
  const [memoOpen, setMemoOpen] = useState(!!(vs.memo && vs.memo.trim()));
  const hasMemo = !!(vs.memo && vs.memo.trim());

  return (
    <div className="vs-content">
      {/* ═══ 기본 V/S 입력 ═══ */}
      <div className="vs-vitals-grid">
        {/* BP */}
        <div className="vs-vital-row">
          <label className="vs-vital-label">BP</label>
          <div className="vs-bp-inputs">
            <input
              type="number"
              value={vs.sbp}
              onChange={e => updateField('sbp', e.target.value)}
              placeholder="120"
              className={`vs-vital-input vs-bp-input ${rangeStatus.sbpOut ? 'out-of-range' : ''}`}
            />
            <span className="vs-bp-slash">/</span>
            <input
              type="number"
              value={vs.dbp}
              onChange={e => updateField('dbp', e.target.value)}
              placeholder="80"
              className={`vs-vital-input vs-bp-input ${rangeStatus.dbpOut ? 'out-of-range' : ''}`}
            />
            <span className="vs-vital-unit">mmHg</span>
          </div>
        </div>

        {/* PR */}
        <div className="vs-vital-row">
          <label className="vs-vital-label">PR</label>
          <div className="vs-single-input-wrap">
            <input
              type="number"
              value={vs.pr}
              onChange={e => updateField('pr', e.target.value)}
              placeholder="72"
              className={`vs-vital-input ${rangeStatus.prOut ? 'out-of-range' : ''}`}
            />
            <span className="vs-vital-unit">회/분</span>
          </div>
        </div>

        {/* RR */}
        <div className="vs-vital-row">
          <label className="vs-vital-label">RR</label>
          <div className="vs-single-input-wrap">
            <input
              type="number"
              value={vs.rr}
              onChange={e => updateField('rr', e.target.value)}
              placeholder="18"
              className={`vs-vital-input ${rangeStatus.rrOut ? 'out-of-range' : ''}`}
            />
            <span className="vs-vital-unit">회/분</span>
          </div>
        </div>

        {/* BT */}
        <div className="vs-vital-row">
          <label className="vs-vital-label">BT</label>
          <div className="vs-single-input-wrap">
            <input
              type="number"
              step="0.1"
              value={vs.bt}
              onChange={e => updateField('bt', e.target.value)}
              placeholder="36.5"
              className={`vs-vital-input ${rangeStatus.btOut ? 'out-of-range' : ''}`}
            />
            <span className="vs-vital-unit">℃</span>
          </div>
        </div>
      </div>

      {/* ═══ 조건부 항목: V/S 범위 밖일 때만 ═══ */}
      <AnimatePresence>
        {rangeStatus.anyOut && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="vs-conditional-wrap"
          >
            <div className="vs-conditional-inner">
              {/* 범위 밖 경고 배지 */}
              <div className="vs-alert-badge">
                <span className="vs-alert-dot" />
                V/S 범위 밖 — 추가 확인 필요
              </div>

              {/* ── 신경학적 검사 ── */}
              <div className="vs-subsection">
                <h4 className="vs-subsection-title">신경학적 검사</h4>
                <div className="vs-neuro-grid">
                  {/* Mental Gr */}
                  <div className="vs-neuro-item">
                    <span className="vs-field-label">Mental</span>
                    <input
                      type="text"
                      value={vs.mentalGr}
                      onChange={e => updateField('mentalGr', e.target.value)}
                      placeholder="Gr"
                      className="vs-text-input"
                    />
                  </div>

                  {/* Pupil */}
                  <div className="vs-neuro-item">
                    <span className="vs-field-label">Pupil</span>
                    <div className="vs-lr-row">
                      <div className="vs-lr-item">
                        <span className="vs-lr-label">Rt</span>
                        <ToggleButton value={vs.pupilRt} defaultVal="0" options={['0', 'Ø']} onChange={v => updateField('pupilRt', v)} />
                      </div>
                      <div className="vs-lr-item">
                        <span className="vs-lr-label">Lt</span>
                        <ToggleButton value={vs.pupilLt} defaultVal="0" options={['0', 'Ø']} onChange={v => updateField('pupilLt', v)} />
                      </div>
                    </div>
                  </div>

                  {/* Babinski */}
                  <div className="vs-neuro-item">
                    <span className="vs-field-label">Babinski</span>
                    <div className="vs-lr-row">
                      <div className="vs-lr-item">
                        <span className="vs-lr-label">Rt</span>
                        <ToggleButton value={vs.babinskiRt} defaultVal="-" options={['-', '+']} onChange={v => updateField('babinskiRt', v)} />
                      </div>
                      <div className="vs-lr-item">
                        <span className="vs-lr-label">Lt</span>
                        <ToggleButton value={vs.babinskiLt} defaultVal="-" options={['-', '+']} onChange={v => updateField('babinskiLt', v)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── 증상 ── */}
              <div className="vs-subsection">
                <h4 className="vs-subsection-title">증상</h4>
                <div className="vs-symptoms-grid">
                  <SymptomToggle label="두통" value={vs.headache} onChange={v => updateField('headache', v)} />
                  <SymptomToggle label="현훈" value={vs.dizziness} onChange={v => updateField('dizziness', v)} />
                  <SymptomToggle label="오심" value={vs.nausea} onChange={v => updateField('nausea', v)} />
                  <SymptomToggle label="구토" value={vs.vomiting} onChange={v => updateField('vomiting', v)} />
                  <SymptomToggle label="흉민" value={vs.chestDiscomfort} onChange={v => updateField('chestDiscomfort', v)} />
                  <SymptomToggle label="흉통" value={vs.chestPain} onChange={v => updateField('chestPain', v)} />
                </div>
              </div>

              {/* ── 생활습관/약물 ── */}
              <div className="vs-subsection">
                <h4 className="vs-subsection-title">생활습관 / 약물</h4>
                <div className="vs-lifestyle-grid">
                  <YNToggle label="혈압약" value={vs.bpMed} onChange={v => updateField('bpMed', v)} />

                  {/* 혈압약 복용 시 → 복용 시점 입력 */}
                  <AnimatePresence>
                    {vs.bpMed === '+' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="vs-med-time-wrap"
                      >
                        <div className="vs-med-time-row">
                          <span className="vs-field-label vs-field-label-indent">복용 시점</span>
                          <input
                            type="text"
                            value={vs.bpMedTime}
                            onChange={e => updateField('bpMedTime', e.target.value)}
                            placeholder="예: 오전 8시"
                            className="vs-text-input vs-med-time-input"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <YNToggle label="운동" value={vs.exercise} onChange={v => updateField('exercise', v)} />
                  <YNToggle label="스트레스" value={vs.stress} onChange={v => updateField('stress', v)} />
                  <YNToggle label="흡연" value={vs.smoking} onChange={v => updateField('smoking', v)} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ 메모 ═══ */}
      <div className="vs-memo-row">
        <span className="vs-field-label">메모</span>
        <button
          onClick={() => setMemoOpen(!memoOpen)}
          className={`memo-toggle-btn ${memoOpen || hasMemo ? 'has-memo' : ''}`}
          title={memoOpen ? '메모 닫기' : '메모 추가'}
        >
          {memoOpen ? <X size={10} /> : <Plus size={10} />}
        </button>
      </div>
      <AnimatePresence>
        {memoOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="memo-container">
              <textarea
                value={vs.memo}
                onChange={e => updateField('memo', e.target.value)}
                placeholder="메모 입력..."
                className="memo-input"
                rows={2}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
