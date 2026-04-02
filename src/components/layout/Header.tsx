import React from 'react';
import './Header.css';

export const Header: React.FC = () => {
  return (
    <header className="header-container bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center h-14 gap-4 md:gap-8">
        <h1 className="text-lg font-bold tracking-tight text-slate-800 flex-shrink-0"> Dr.Ask - 빠른 문진</h1>
        <nav className="nav-container flex items-center gap-2 md:gap-4 h-full flex-1">
          <button className="nav-item" onClick={() => { alert("아직 작업 중입니다.") }}>C/C 및 P/I</button>
          <button className="nav-item active">이학적 검사</button>
          <button className="nav-item" onClick={() => { alert("아직 작업 중입니다.") }}> Prn 및 V/S </button>
          <button className="nav-item" onClick={() => { alert("아직 작업 중입니다.") }}> Info </button>
        </nav>
      </div>
    </header>
  );
};
