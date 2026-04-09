import React, { useState } from 'react';
import { ChevronDown, RotateCcw, Activity, Droplets, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VitalSignsState } from '../../hooks/useVitalSigns';
import { VitalSignsSection } from './VitalSignsSection';
import './PrnVsPage.css';

// ─── 아코디언 섹션별 설정 ───
type SectionId = 'vs' | 'bst' | 'prn_headache' | 'prn_fatigue' | 'prn_respiratory' 
  | 'prn_abdominal' | 'prn_vomiting' | 'prn_insomnia' | 'prn_pain' | 'prn_itching' | 'prn_cc';

interface SectionConfig {
  id: SectionId;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  enabled: boolean;
}

const SECTIONS: SectionConfig[] = [
  { id: 'vs', title: 'V/S', subtitle: 'Vital Signs', icon: <Activity size={16} />, iconBg: 'bg-rose-500', enabled: true },
  { id: 'bst', title: 'BST', subtitle: 'Blood Sugar Test', icon: <Droplets size={16} />, iconBg: 'bg-amber-500', enabled: false },
  { id: 'prn_headache', title: '두통/현훈', subtitle: 'PRN - Headache/Dizziness', icon: <FileText size={16} />, iconBg: 'bg-violet-500', enabled: false },
  { id: 'prn_fatigue', title: '기력저하', subtitle: 'PRN - Fatigue', icon: <FileText size={16} />, iconBg: 'bg-violet-500', enabled: false },
  { id: 'prn_respiratory', title: '호흡기증상', subtitle: 'PRN - Respiratory', icon: <FileText size={16} />, iconBg: 'bg-sky-500', enabled: false },
  { id: 'prn_abdominal', title: '복부증상', subtitle: 'PRN - Abdominal', icon: <FileText size={16} />, iconBg: 'bg-teal-500', enabled: false },
  { id: 'prn_vomiting', title: '구토', subtitle: 'PRN - Vomiting', icon: <FileText size={16} />, iconBg: 'bg-violet-500', enabled: false },
  { id: 'prn_insomnia', title: '불면', subtitle: 'PRN - Insomnia', icon: <FileText size={16} />, iconBg: 'bg-indigo-500', enabled: false },
  { id: 'prn_pain', title: '통증', subtitle: 'PRN - Pain', icon: <FileText size={16} />, iconBg: 'bg-orange-500', enabled: false },
  { id: 'prn_itching', title: '소양감', subtitle: 'PRN - Itching', icon: <FileText size={16} />, iconBg: 'bg-lime-600', enabled: false },
  { id: 'prn_cc', title: 'C/C 관련', subtitle: 'PRN - Chief Complaint', icon: <FileText size={16} />, iconBg: 'bg-slate-500', enabled: false },
];

interface PrnVsPageProps {
  vs: VitalSignsState;
  updateField: (field: keyof VitalSignsState, value: string) => void;
  resetAll: () => void;
  rangeStatus: {
    bpOut: boolean; sbpOut: boolean; dbpOut: boolean;
    prOut: boolean; rrOut: boolean; btOut: boolean;
    anyOut: boolean;
  };
  hasAnyValue: boolean;
}

export const PrnVsPage: React.FC<PrnVsPageProps> = ({
  vs, updateField, resetAll, rangeStatus, hasAnyValue
}) => {
  const [openSections, setOpenSections] = useState<Set<SectionId>>(new Set(['vs']));

  const toggleSection = (id: SectionId) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // V/S 상태 배지
  const getVsStatusBadge = () => {
    if (!hasAnyValue) return <span className="prnvs-status-badge empty">미입력</span>;
    if (rangeStatus.anyOut) return <span className="prnvs-status-badge abnormal">범위 밖</span>;
    return <span className="prnvs-status-badge normal">정상</span>;
  };

  // 섹션 콘텐츠 렌더링
  const renderSectionContent = (section: SectionConfig) => {
    if (!section.enabled) {
      return (
        <div className="vs-content">
          <p className="prnvs-placeholder">추후 구현 예정입니다.</p>
        </div>
      );
    }

    switch (section.id) {
      case 'vs':
        return (
          <VitalSignsSection
            vs={vs}
            updateField={updateField}
            rangeStatus={rangeStatus}
          />
        );
      default:
        return null;
    }
  };

  // 섹션 상태 배지
  const renderStatusBadge = (section: SectionConfig) => {
    if (section.id === 'vs') return getVsStatusBadge();
    if (!section.enabled) return <span className="prnvs-status-badge empty">준비중</span>;
    return null;
  };

  // 섹션 리셋 핸들러
  const handleReset = (section: SectionConfig, e: React.MouseEvent) => {
    e.stopPropagation();
    if (section.id === 'vs') resetAll();
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 flex flex-col gap-3">
      {SECTIONS.map(section => {
        const isOpen = openSections.has(section.id);
        return (
          <div key={section.id} className={`prnvs-section ${isOpen ? 'open' : ''} ${!section.enabled ? 'opacity-60' : ''}`}>
            {/* 헤더 */}
            <div
              className="prnvs-section-header"
              onClick={() => toggleSection(section.id)}
            >
              <div className="prnvs-section-header-left">
                <div className={`prnvs-section-icon ${section.iconBg}`}>
                  {section.icon}
                </div>
                <div>
                  <div className="prnvs-section-title">{section.title}</div>
                  <div className="prnvs-section-subtitle">{section.subtitle}</div>
                </div>
              </div>
              <div className="prnvs-section-header-right">
                {renderStatusBadge(section)}
                {section.enabled && isOpen && hasAnyValue && section.id === 'vs' && (
                  <button
                    className="prnvs-reset-btn"
                    onClick={e => handleReset(section, e)}
                    title="초기화"
                  >
                    <RotateCcw size={12} />
                  </button>
                )}
                <ChevronDown size={16} className={`prnvs-chevron ${isOpen ? 'open' : ''}`} />
              </div>
            </div>

            {/* 바디 - 아코디언 */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="prnvs-section-body">
                    {renderSectionContent(section)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
