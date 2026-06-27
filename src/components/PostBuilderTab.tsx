/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Check, 
  Copy, 
  BookOpen, 
  Award, 
  HelpCircle, 
  AlertTriangle,
  Lightbulb,
  CornerDownRight
} from 'lucide-react';
import { POST_STRUCTURES } from '../data/templates';

export default function PostBuilderTab() {
  const [selectedType, setSelectedType] = useState('expert');
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [draftText, setDraftText] = useState('');

  const handleSelectType = (type: string) => {
    setSelectedType(type);
    setTimeout(() => {
      const element = document.getElementById('blueprint-details');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const currentStructure = POST_STRUCTURES.find(s => s.type === selectedType) || POST_STRUCTURES[0];

  const handleCopyDraft = () => {
    if (draftText.trim()) {
      navigator.clipboard.writeText(draftText);
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2000);
    }
  };

  const handleInsertStructureTemplate = () => {
    const template = currentStructure.steps.map(step => {
      return `--- ${step.title} ---\n// ${step.description}\n[Ваш текст здесь...]`;
    }).join('\n\n');
    setDraftText(template);
  };

  return (
    <div id="post-builder-tab" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Structural Templates Menu (Left column) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4">
          <h3 className="font-black text-slate-900 text-base font-sans flex items-center gap-2 tracking-tight">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Выбор формулы поста
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            Посты, написанные по четким формулам, дочитывают на 83% чаще. Выберите структуру под вашу задачу:
          </p>

          <div className="space-y-2">
            {POST_STRUCTURES.map(s => {
              const isActive = selectedType === s.type;
              return (
                <button
                  key={s.type}
                  type="button"
                  onClick={() => {
                    handleSelectType(s.type);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                      : 'bg-slate-50 border-slate-150 hover:border-slate-200 text-slate-700 hover:bg-slate-100/50'
                  }`}
                >
                  <span className="font-extrabold text-xs">{s.title}</span>
                  <CornerDownRight className={`w-3.5 h-3.5 ${isActive ? 'text-white/80' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Structural Breakdown info card */}
        <div className="bg-indigo-600 text-white rounded-[2rem] p-6 shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500 rounded-full blur-2xl opacity-50 -mr-4 -mt-4"></div>
          <div className="flex items-center gap-2 text-white relative z-10">
            <BookOpen className="w-5 h-5 text-indigo-100" />
            <h4 className="font-black text-sm tracking-tight">Почему это работает?</h4>
          </div>
          <p className="text-xs leading-relaxed text-indigo-100 relative z-10 font-medium">
            Каждая формула учитывает психологию восприятия информации пользователем. Мы ведем читателя от захвата внимания к погружению в проблему, даем инсайт и завершаем легким и понятным действием.
          </p>
          <div className="bg-indigo-750/50 p-4 rounded-2xl border border-indigo-500/30 text-[11px] leading-relaxed text-indigo-200 italic relative z-10 font-medium">
            💡 Совет: Не продавайте в каждом посте. Соблюдайте баланс: 70% пользы, историй и интерактива, и только 30% — прямых коммерческих предложений.
          </div>
        </div>
      </div>

      {/* Blueprint Construction details & Sandbox Draft Area (Right column) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Step-by-step roadmap view */}
        <div id="blueprint-details" className="scroll-mt-24 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest font-mono">Анатомический скелет поста</span>
              <h3 className="font-black text-slate-900 text-lg tracking-tight leading-tight">{currentStructure.title}</h3>
            </div>
          </div>

          <div className="space-y-4">
            {currentStructure.steps.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-7 h-7 rounded-full bg-slate-150 text-slate-800 border border-slate-200/50 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 font-mono">
                  {idx + 1}
                </div>
                <div className="space-y-1 flex-1 bg-slate-50 p-4 rounded-[1.5rem] border border-slate-150/50">
                  <h5 className="font-extrabold text-slate-900 text-xs">{step.title}</h5>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">{step.description}</p>
                  <div className="text-xs text-indigo-600 italic mt-2.5 bg-white p-3 rounded-xl border border-indigo-50 font-sans leading-relaxed font-medium">
                    <span className="font-black not-italic text-[9px] text-indigo-400 uppercase tracking-widest block mb-1 font-mono">Пример:</span>
                    {step.example}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Button moved to the bottom of the template card, right above the text editor */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={handleInsertStructureTemplate}
              className="w-full sm:w-auto text-xs font-black uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] px-6 py-3.5 rounded-xl transition-all cursor-pointer border border-indigo-600 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              Загрузить этот шаблон в редактор ниже ✍️
            </button>
          </div>
        </div>

        {/* Scratchpad Textarea and characters count */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Черновик и песочница</span>
              <h4 className="font-black text-slate-900 text-sm tracking-tight">Редактор контента</h4>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-400 font-bold font-mono">{draftText.length} СИМВ.</span>
              {draftText.trim() && (
                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                    copiedDraft 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                      : 'bg-white border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200'
                  }`}
                >
                  {copiedDraft ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedDraft ? 'Скопировано!' : 'Копировать'}
                </button>
              )}
            </div>
          </div>

          <textarea
            className="w-full h-64 p-4 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans text-slate-700 leading-relaxed resize-y"
            placeholder="Пишите или вставьте структуру по кнопке выше, чтобы начать заполнять пост пошагово..."
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
          />

          <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-2xl p-4 text-xs text-amber-800 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="font-medium">
              Отредактированный черновик можно быстро проверить во вкладке <strong>«Адаптер постов»</strong>, чтобы увидеть, как он будет восприниматься читателями на разных площадках.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
