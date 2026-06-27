/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Copy, Check, Lightbulb, HelpCircle, ArrowRight } from 'lucide-react';
import { getRubricsForNiche } from '../data/templates';

interface RubricatorTabProps {
  selectedNiche: string;
  onTabChange?: (tabId: 'plan') => void;
}

export default function RubricatorTab({ selectedNiche, onTabChange }: RubricatorTabProps) {
  const rubrics = getRubricsForNiche(selectedNiche);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="rubricator-tab" className="space-y-6">
      <div className="bg-indigo-600 text-white p-6 rounded-[2rem] border border-indigo-700 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-2xl opacity-50 -mr-6 -mt-6"></div>
        <h3 className="text-xl font-black text-white flex items-center gap-2 mb-2 font-sans tracking-tight">
          <Lightbulb className="w-5 h-5 text-indigo-100" />
          Автоматический рубрикатор для ниши «{selectedNiche}»
        </h3>
        <p className="text-xs text-indigo-100 leading-relaxed max-w-3xl">
          Успешный SMM строится на балансе разного контента. Мы разработали 8 ключевых рубрик, 
          которые закрывают все потребности прогрева аудитории: от доверия до прямых продаж. 
          Используйте эти темы для наполнения вашего блога.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rubrics.map((rubric) => {
          const isCopied = copiedId === rubric.id;
          return (
            <div 
              key={rubric.id}
              id={`rubric-card-${rubric.id}`}
              className="bg-white border border-slate-200/80 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider">
                    {rubric.title}
                  </span>
                  <div className="p-1 rounded bg-slate-50 text-slate-400 group relative cursor-pointer">
                    <HelpCircle className="w-4 h-4 hover:text-indigo-600 transition-colors" />
                    <span className="absolute right-0 bottom-6 hidden group-hover:block bg-slate-900 text-white text-[10px] rounded-xl p-2.5 w-48 shadow-lg z-10 font-normal leading-normal">
                      {rubric.description}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-6 font-semibold leading-relaxed">
                  {rubric.description}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150/50 mt-auto border-l-4 border-indigo-500">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider font-mono">Готовая тема поста:</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(rubric.exampleTopic, rubric.id)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold ${
                      isCopied 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                        : 'bg-white border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200'
                    }`}
                    title="Копировать тему"
                  >
                    {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Скопировано!' : 'Копировать'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-900 font-bold leading-relaxed">
                  {rubric.exampleTopic}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 text-white p-6 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 border border-slate-850 shadow-md">
        <div className="space-y-1">
          <h4 className="font-extrabold text-sm tracking-tight">Готовы составить пошаговый календарь?</h4>
          <p className="text-xs text-slate-400">Система автоматически распределит эти рубрики по дням недели.</p>
        </div>
        <button
          type="button"
          onClick={() => onTabChange?.('plan')}
          className="flex items-center gap-2 text-[10px] font-black text-indigo-300 uppercase tracking-widest bg-white/5 hover:bg-white/10 px-5 py-3 rounded-xl border border-white/10 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Перейти во вкладку «Контент-План» <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
        </button>
      </div>
    </div>
  );
}
