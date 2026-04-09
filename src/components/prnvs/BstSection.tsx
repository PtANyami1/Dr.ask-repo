import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BstState, BstRangeStatus } from '../../hooks/useBst';

interface BstSectionProps {
  bstState: BstState;
  updateField: (field: keyof BstState, value: string) => void;
  rangeStatus: BstRangeStatus;
  isOutOfRange: boolean;
}

// ─── 토글 버튼 ───
const ToggleButton: React.FC<{
  value: string;
  defaultVal: string;
  options: [string, string];
  onChange: (val: string) => void;
}> = ({ value, defaultVal, options, onChange }) => (
  <div className="vs-toggle-container">
    {options.map(opt => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`vs-toggle-btn ${
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

// ─── 증상 토글 ───
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

// ─── YN 토글 행 ───
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

export const BstSection: React.FC<BstSectionProps> = ({
  bstState, updateField, rangeStatus, isOutOfRange
}) => {
  const [memoOpen, setMemoOpen] = useState(!!(bstState.memo && bstState.memo.trim()));
  const hasMemo = !!(bstState.memo && bstState.memo.trim());

  return (
    <div className="vs-content">
      {/* ═══ 기본 BST 입력 ═══ */}
      <div className="vs-vitals-grid">
        {/* BST 수치 */}
        <div className="vs-vital-row">
          <label className="vs-vital-label">BST</label>
          <div className="vs-single-input-wrap">
            <input
              type="number"
              value={bstState.bst}
              onChange={e => updateField('bst', e.target.value)}
              placeholder="100"
              className={`vs-vital-input ${rangeStatus === 'high' || rangeStatus === 'low' ? 'out-of-range' : ''}`}
            />
            <span className="vs-vital-unit">mg/dL</span>
          </div>
        </div>

        {/* 인슐린 투여 여부 */}
        <div className="vs-vital-row">
          <label className="vs-vital-label bst-label-wide">인슐린</label>
          <div className="vs-single-input-wrap">
            <ToggleButton
              value={bstState.insulin}
              defaultVal="-"
              options={['-', '+']}
              onChange={v => updateField('insulin', v)}
            />
            <span className="vs-vital-unit bst-threshold-hint">
              {bstState.insulin === '+' ? '(저혈당 <80)' : '(저혈당 <60)'}
            </span>
          </div>
        </div>
      </div>

      {/* ═══ 조건부: 고혈당/저혈당 시 ═══ */}
      <AnimatePresence>
        {isOutOfRange && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="vs-conditional-wrap"
          >
            <div className="vs-conditional-inner">
              {/* 범위 밖 경고 배지 */}
              <div className={`vs-alert-badge ${rangeStatus === 'high' ? 'bst-high' : 'bst-low'}`}>
                <span className="vs-alert-dot" />
                {rangeStatus === 'high'
                  ? `고혈당 (BST ${bstState.bst} ≥ 200) — 추가 확인 필요`
                  : `저혈당 (BST ${bstState.bst} < ${bstState.insulin === '+' ? '80' : '60'}) — 추가 확인 필요`
                }
              </div>

              {/* ── 고혈당 증상 ── */}
              {rangeStatus === 'high' && (
                <div className="vs-subsection">
                  <h4 className="vs-subsection-title">고혈당 증상</h4>
                  <div className="vs-symptoms-grid">
                    <SymptomToggle label="다음" value={bstState.polydipsia} onChange={v => updateField('polydipsia', v)} />
                    <SymptomToggle label="다뇨" value={bstState.polyuria} onChange={v => updateField('polyuria', v)} />
                    <SymptomToggle label="수족비증" value={bstState.numbHands} onChange={v => updateField('numbHands', v)} />
                    <SymptomToggle label="피로감" value={bstState.fatigue} onChange={v => updateField('fatigue', v)} />
                    <SymptomToggle label="소양감" value={bstState.itching} onChange={v => updateField('itching', v)} />
                  </div>
                </div>
              )}

              {/* ── 저혈당 증상 ── */}
              {rangeStatus === 'low' && (
                <div className="vs-subsection">
                  <h4 className="vs-subsection-title">저혈당 증상</h4>
                  <div className="vs-symptoms-grid">
                    <SymptomToggle label="현훈" value={bstState.dizziness} onChange={v => updateField('dizziness', v)} />
                    <SymptomToggle label="심계" value={bstState.palpitation} onChange={v => updateField('palpitation', v)} />
                    <SymptomToggle label="저림" value={bstState.numbness} onChange={v => updateField('numbness', v)} />
                    <SymptomToggle label="창백" value={bstState.pallor} onChange={v => updateField('pallor', v)} />
                    <SymptomToggle label="피곤" value={bstState.tired} onChange={v => updateField('tired', v)} />
                    <SymptomToggle label="호흡곤란" value={bstState.dyspnea} onChange={v => updateField('dyspnea', v)} />
                    <SymptomToggle label="한출" value={bstState.sweating} onChange={v => updateField('sweating', v)} />
                  </div>
                </div>
              )}

              {/* ── 공통: 약물/식사/운동 ── */}
              <div className="vs-subsection">
                <h4 className="vs-subsection-title">약물 / 식사 / 운동</h4>
                <div className="vs-lifestyle-grid">
                  <YNToggle label="당뇨약" value={bstState.dmMed} onChange={v => updateField('dmMed', v)} />

                  {/* 당뇨약 복용 시점 */}
                  <AnimatePresence>
                    {bstState.dmMed === '+' && (
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
                            value={bstState.dmMedTime}
                            onChange={e => updateField('dmMedTime', e.target.value)}
                            placeholder="예: 아침 식후"
                            className="vs-text-input vs-med-time-input"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 인슐린 투여 시점 (인슐린 투여 시만) */}
                  <AnimatePresence>
                    {bstState.insulin === '+' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="vs-med-time-wrap"
                      >
                        <div className="vs-med-time-row">
                          <span className="vs-field-label">인슐린 투여 시점</span>
                          <input
                            type="text"
                            value={bstState.insulinTime}
                            onChange={e => updateField('insulinTime', e.target.value)}
                            placeholder="예: 식전 30분"
                            className="vs-text-input vs-med-time-input"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 식사 */}
                  <div className="vs-yn-row">
                    <span className="vs-field-label">식사</span>
                    <input
                      type="text"
                      value={bstState.meal}
                      onChange={e => updateField('meal', e.target.value)}
                      placeholder="예: 아침 식사 완료"
                      className="vs-text-input bst-text-wide"
                    />
                  </div>

                  {/* 간식 */}
                  <div className="vs-yn-row">
                    <span className="vs-field-label">간식</span>
                    <input
                      type="text"
                      value={bstState.snack}
                      onChange={e => updateField('snack', e.target.value)}
                      placeholder="예: 없음"
                      className="vs-text-input bst-text-wide"
                    />
                  </div>

                  {/* 음수량 */}
                  <div className="vs-yn-row">
                    <span className="vs-field-label">음수량</span>
                    <input
                      type="text"
                      value={bstState.fluidIntake}
                      onChange={e => updateField('fluidIntake', e.target.value)}
                      placeholder="예: 500ml"
                      className="vs-text-input bst-text-wide"
                    />
                  </div>

                  {/* 운동 */}
                  <YNToggle label="운동" value={bstState.exercise} onChange={v => updateField('exercise', v)} />

                  {/* 운동량 (운동 시에만) */}
                  <AnimatePresence>
                    {bstState.exercise === '+' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="vs-med-time-wrap"
                      >
                        <div className="vs-med-time-row">
                          <span className="vs-field-label vs-field-label-indent">운동량</span>
                          <input
                            type="text"
                            value={bstState.exerciseAmount}
                            onChange={e => updateField('exerciseAmount', e.target.value)}
                            placeholder="예: 30분 걷기"
                            className="vs-text-input vs-med-time-input"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                value={bstState.memo}
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
