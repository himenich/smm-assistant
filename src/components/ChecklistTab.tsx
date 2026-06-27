/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ChecklistItem } from '../types';
import { getPackChecklist } from '../data/templates';
import { CheckSquare, Square, Award, ArrowUpRight, Sparkles, RefreshCw } from 'lucide-react';

interface ChecklistTabProps {
  selectedNiche: string;
}

export default function ChecklistTab({ selectedNiche }: ChecklistTabProps) {
  const [items, setItems] = useState<ChecklistItem[]>([]);

  // Load state from localStorage on init
  useEffect(() => {
    const storageKey = `smm_checklist_${selectedNiche.replace(/\s+/g, '_')}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        setItems(getPackChecklist(selectedNiche));
      }
    } else {
      setItems(getPackChecklist(selectedNiche));
    }
  }, [selectedNiche]);

  // Save to localStorage when items update
  const saveItems = (updatedItems: ChecklistItem[]) => {
    setItems(updatedItems);
    const storageKey = `smm_checklist_${selectedNiche.replace(/\s+/g, '_')}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
  };

  const handleToggle = (id: string) => {
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    saveItems(updated);
  };

  const handleReset = () => {
    const reset = getPackChecklist(selectedNiche);
    saveItems(reset);
  };

  const handleCompleteAll = () => {
    const allDone = items.map(i => ({ ...i, completed: true }));
    saveItems(allDone);
  };

  // Calculations
  const completedCount = items.filter(i => i.completed).length;
  const totalCount = items.length || 10;
  const percentage = Math.round((completedCount / totalCount) * 100);

  // Status message
  let statusMessage = 'Начните упаковку профиля 📦';
  let statusColor = 'text-slate-500';
  if (percentage >= 100) {
    statusMessage = 'Поздравляем! Ваш аккаунт — идеальный магнит клиентов! 🏆';
    statusColor = 'text-emerald-600 font-bold';
  } else if (percentage >= 70) {
    statusMessage = 'Отлично! Профиль выглядит профессионально и готов продавать 🚀';
    statusColor = 'text-indigo-600 font-bold';
  } else if (percentage >= 40) {
    statusMessage = 'Хороший темп! Осталось докрутить несколько технических штрихов ⚙️';
    statusColor = 'text-amber-600 font-bold';
  } else if (percentage > 0) {
    statusMessage = 'Первые кирпичики заложены! Продолжайте по списку 🏗️';
    statusColor = 'text-slate-700 font-semibold';
  }

  return (
    <div id="checklist-tab" className="space-y-6">
      
      {/* Progress Box Card */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 flex-1 w-full">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Уровень упаковки аккаунта</span>
            <span className="text-[10px] text-slate-400 font-bold font-mono">{completedCount} ИЗ {totalCount} ЭЛЕМЕНТОВ</span>
          </div>

          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-sans font-black text-slate-900 tracking-tight">
              Профиль готов на <span className="text-indigo-600">{percentage}%</span>
            </h3>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                percentage >= 100 
                  ? 'bg-emerald-500' 
                  : percentage >= 70 
                    ? 'bg-indigo-600' 
                    : percentage >= 40 
                      ? 'bg-amber-400' 
                      : 'bg-indigo-400'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className={`text-xs font-semibold mt-1 ${statusColor}`}>
            {statusMessage}
          </p>
        </div>

        {/* Quick Operations panel */}
        <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={handleCompleteAll}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center shadow-sm"
          >
            Выбрать все
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2.5 text-slate-400 hover:text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center inline-flex items-center justify-center gap-1.5 border border-slate-200"
            title="Сбросить прогресс"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Сброс
          </button>
        </div>
      </div>

      {/* Main Checklist Items List */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <h4 className="font-black text-slate-900 text-sm tracking-tight">Пошаговый чеклист упаковки профиля</h4>
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 self-start sm:self-auto font-mono">
            Ниша: {selectedNiche}
          </span>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`flex items-start gap-4 p-4 rounded-[1.5rem] transition-all cursor-pointer border ${
                item.completed 
                  ? 'bg-emerald-50/10 border-emerald-100 hover:bg-emerald-50/20' 
                  : 'bg-white border-slate-150 hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 focus:outline-none flex-shrink-0 cursor-pointer"
              >
                {item.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300 hover:text-indigo-600 transition-colors" />
                )}
              </button>

              <div className="space-y-1.5 flex-1">
                <span className={`text-xs leading-relaxed transition-all ${
                  item.completed ? 'text-slate-400 line-through font-medium' : 'text-slate-800 font-bold'
                }`}>
                  {item.text}
                </span>
                
                {/* Visual badges for elements */}
                <div className="flex gap-1.5 pt-0.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">
                    {item.id === 'avatar' && '🧑‍💼 Визуальный фокус'}
                    {item.id === 'cover' && '🖼️ Лицо профиля'}
                    {item.id === 'bio' && '📝 Главное УТП'}
                    {item.id === 'highlight' && '📖 Прогрев-знакомство'}
                    {item.id === 'widgets' && '⚙️ Быстрые кнопки'}
                    {item.id === 'contacts' && '📞 Канал связи'}
                    {item.id === 'gift' && '🎁 Лид-магнит'}
                    {item.id === 'content_plan' && '🗂️ Экспертная база'}
                    {item.id === 'links' && '🔗 Мультиссылка'}
                    {item.id === 'funnel' && '🤖 Автоматизация'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist Packaging recommendation card */}
      <div className="bg-indigo-600 text-white p-6 rounded-[2rem] shadow-xl flex items-start gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500 rounded-full blur-2xl opacity-50 -mr-4 -mt-4"></div>
        <Sparkles className="w-5 h-5 text-indigo-100 mt-0.5 flex-shrink-0 relative z-10" />
        <div className="space-y-1 relative z-10">
          <h4 className="font-black text-white text-sm tracking-tight">Почему упаковка важна?</h4>
          <p className="text-xs leading-relaxed text-indigo-100 font-medium">
            Даже идеальный контент не принесет продаж, если посетитель попадает в "пустой" профиль. 
            Упаковка по этому списку гарантирует, что 8 из 10 новых посетителей сразу поймут, чем вы полезны, 
            найдут подтверждение вашей экспертности и смогут легко записаться на ваши услуги.
          </p>
        </div>
      </div>

    </div>
  );
}
