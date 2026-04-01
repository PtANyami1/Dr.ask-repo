import React, { useState, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

import { useExamState } from './hooks/useExamState';
import { EXAM_TEMPLATES } from './data/index';
import { Header } from './components/layout/Header';
import { CategorySidebar } from './components/exam/CategorySidebar';
import { ExamCard } from './components/exam/ExamCard';
import { OutputPanel } from './components/exam/OutputPanel';
import { GuideModal } from './components/common/GuideModal';

import './App.css';

const CATEGORIES = Array.from(new Set(EXAM_TEMPLATES.map(t => t.category)));

export default function App() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['CVA']);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const [isOutputPanelOpen, setIsOutputPanelOpen] = useState(false);

  const {
    examState,
    modifiedCount,
    handleValueChange,
    resetExam,
    generateOutput,
    copied,
    copyToClipboard,
    guideInfo,
    setGuideInfo
  } = useExamState();

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearCategories = () => setSelectedCategories([]);

  const filteredTemplates = useMemo(() => {
    return EXAM_TEMPLATES.filter(t => selectedCategories.includes(t.category));
  }, [selectedCategories]);

  const outputText = useMemo(() => generateOutput(selectedCategories), [generateOutput, selectedCategories]);

  const handleCopy = () => copyToClipboard(outputText);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      <Header />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-0 md:gap-6 p-4 md:p-8 pt-0 md:pt-8">
        <CategorySidebar 
          categories={CATEGORIES}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          clearCategories={clearCategories}
          isMobileOpen={isMobileCategoryOpen}
          setIsMobileOpen={setIsMobileCategoryOpen}
        />

        <main className="flex-1">
          {selectedCategories.length === 0 ? (
            <div className="empty-state-container border-dashed">
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
                  <div key={category} className="category-section">
                    <h2 className="category-title">
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
                            <ExamCard 
                              key={template.id}
                              template={template}
                              examState={examState}
                              handleValueChange={handleValueChange}
                              resetExam={resetExam}
                              onShowGuide={(title, content) => setGuideInfo({ title, content })}
                              isChanged={isChanged}
                            />
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

      <OutputPanel 
        isPanelOpen={isOutputPanelOpen}
        setIsPanelOpen={setIsOutputPanelOpen}
        modifiedCount={modifiedCount}
        selectedCategoriesLength={selectedCategories.length}
        outputText={outputText}
        copyToClipboard={handleCopy}
        copied={copied}
      />

      <GuideModal 
        isOpen={!!guideInfo} 
        onClose={() => setGuideInfo(null)}
        title={guideInfo?.title || ''}
        content={guideInfo?.content || ''}
      />
    </div>
  );
}
