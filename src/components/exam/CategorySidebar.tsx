import React from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import './CategorySidebar.css';

interface CategorySidebarProps {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (cat: string) => void;
  clearCategories: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategories,
  toggleCategory,
  clearCategories,
  isMobileOpen,
  setIsMobileOpen
}) => {
  return (
    <>
      {/* Mobile Category Dropdown */}
      <div className="md:hidden sticky top-[56px] z-20 bg-slate-50 pt-3 pb-2 -mx-4 px-4 border-b border-slate-200/50 shadow-sm mb-4">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="mobile-category-btn"
        >
          <span className="font-bold text-sm text-slate-700">
            Categories <span className="text-blue-600">({selectedCategories.length})</span>
          </span>
          <ChevronDown size={18} className={`text-slate-400 transform transition-transform duration-300 ${isMobileOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pt-3 pb-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`mobile-cat-item ${
                      selectedCategories.includes(cat) ? 'active' : ''
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategories.includes(cat) && <CheckCircle2 size={14} className="opacity-80" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-56 lg:w-64 flex-shrink-0 sticky top-24 z-20 self-start">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</h2>
            {selectedCategories.length > 0 && (
              <button 
                onClick={clearCategories}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`desktop-cat-item ${
                  selectedCategories.includes(cat) ? 'active' : ''
                }`}
              >
                <span>{cat}</span>
                {selectedCategories.includes(cat) && (
                  <CheckCircle2 size={16} className="opacity-70" />
                )}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};
