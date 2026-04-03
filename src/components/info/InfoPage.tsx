import React from 'react';

export const InfoPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 md:p-12">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Dr.Ask 소개</h2>

      <section className="mb-8">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">사이트 소개</h3>
        <p className="text-slate-600 leading-relaxed text-sm">
          빠른 문진 그리고 빠른 입력을 돕기 위해 만든 사이트입니다. 현재 개발중인 서비스로 내용이 자주 변경될 수 있습니다. 사용에 참고 부탁드리고 많은 피드백 부탁드립니다. 감사합니다! (내용은 추후 업데이트 예정입니다.)  
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">사용 방법</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
          <li>이학적 검사를 시행할 부위들을 모두 선택하세요.</li>
          <li>선택한 부위에 대한 검사를 진행하고 결과를 입력하세요.</li>
          <li>모든 검사가 완료되면 결과를 확인하고 필요시 수정하고 복사하기를 선택하세요.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">버전 정보</h3>
        <p className="text-sm text-slate-400"> Ver. 0.0.1 - Dev</p>
      </section>
    </div>
  );
};
