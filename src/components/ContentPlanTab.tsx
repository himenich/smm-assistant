/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Copy, 
  Check, 
  Edit3, 
  Save, 
  Info, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { generateContentPlan } from '../data/templates';
import { ContentPlanDay } from '../types';

interface ContentPlanTabProps {
  selectedNiche: string;
  onPlanProgressChange?: (publishedCount: number, totalCount: number) => void;
}

export default function ContentPlanTab({ selectedNiche, onPlanProgressChange }: ContentPlanTabProps) {
  const [postsPerWeek, setPostsPerWeek] = useState<3 | 5 | 7>(5);
  const [plan, setPlan] = useState<ContentPlanDay[]>([]);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [noteText, setNoteText] = useState('');
  const [copiedDay, setCopiedDay] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'published' | 'pending'>('all');
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  // Load plan from localStorage or generate a new one
  useEffect(() => {
    const storageKey = `smm_plan_${selectedNiche.replace(/\s+/g, '_')}_${postsPerWeek}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ContentPlanDay[];
        setPlan(parsed);
      } catch (e) {
        const freshPlan = generateContentPlan(selectedNiche, postsPerWeek);
        setPlan(freshPlan);
      }
    } else {
      const freshPlan = generateContentPlan(selectedNiche, postsPerWeek);
      setPlan(freshPlan);
    }
  }, [selectedNiche, postsPerWeek]);

  // Update localStorage and trigger stats callbacks when plan state changes
  useEffect(() => {
    if (plan.length > 0) {
      const storageKey = `smm_plan_${selectedNiche.replace(/\s+/g, '_')}_${postsPerWeek}`;
      localStorage.setItem(storageKey, JSON.stringify(plan));
      
      const published = plan.filter(d => d.published && d.postType !== 'stories_only').length;
      const total = plan.filter(d => d.postType !== 'stories_only').length;
      
      if (onPlanProgressChange) {
        onPlanProgressChange(published, total);
      }
    }
  }, [plan, selectedNiche, postsPerWeek]);

  const handleTogglePublish = (dayNumber: number) => {
    setPlan(prev => prev.map(day => {
      if (day.dayNumber === dayNumber) {
        const isNowPublished = !day.published;
        
        try {
          const savedStats = localStorage.getItem('smm_activity_stats');
          let currentStats = {
            postsThisWeek: 0,
            storiesThisWeek: 0,
            daysWithoutContent: 0,
            activityPercentage: 0
          };
          if (savedStats) {
            currentStats = JSON.parse(savedStats);
          }
          
          let postsDiff = 0;
          let storiesDiff = 0;
          if (day.postType === 'stories_only') {
            storiesDiff = isNowPublished ? 1 : -1;
          } else {
            postsDiff = isNowPublished ? 1 : -1;
          }
          
          const newPosts = Math.max(0, currentStats.postsThisWeek + postsDiff);
          const newStories = Math.max(0, currentStats.storiesThisWeek + storiesDiff);
          
          let newDaysOff = currentStats.daysWithoutContent;
          if (isNowPublished) {
            newDaysOff = 0;
          }
          
          const postWeight = Math.min(newPosts / 5, 1) * 50;
          const storyWeight = Math.min(newStories / 10, 1) * 40;
          const regularityWeight = (newPosts > 0 || newStories > 0) ? Math.max((7 - newDaysOff) / 7, 0) * 10 : 0;
          const percentage = Math.round(postWeight + storyWeight + regularityWeight);
          
          localStorage.setItem('smm_activity_stats', JSON.stringify({
            postsThisWeek: newPosts,
            storiesThisWeek: newStories,
            daysWithoutContent: newDaysOff,
            activityPercentage: percentage
          }));
        } catch (e) {
          console.error(e);
        }

        return { ...day, published: isNowPublished };
      }
      return day;
    }));
  };

  const handleStartEdit = (dayNumber: number, currentNotes: string = '') => {
    setEditingDay(dayNumber);
    setNoteText(currentNotes);
  };

  const handleSaveNotes = (dayNumber: number) => {
    setPlan(prev => prev.map(day => {
      if (day.dayNumber === dayNumber) {
        return { ...day, notes: noteText };
      }
      return day;
    }));
    setEditingDay(null);
  };

  const handleCopyDay = (day: ContentPlanDay) => {
    const text = `День ${day.dayNumber} (${day.dayOfWeek})\nРубрика: ${day.rubric}\nТема: ${day.topic}\nЗаметки: ${day.notes || 'нет'}`;
    navigator.clipboard.writeText(text);
    setCopiedDay(day.dayNumber);
    setTimeout(() => setCopiedDay(null), 2000);
  };

  // Stats calculation
  const totalPosts = plan.filter(d => d.postType !== 'stories_only').length;
  const publishedPosts = plan.filter(d => d.published && d.postType !== 'stories_only').length;
  const percentComplete = totalPosts > 0 ? Math.round((publishedPosts / totalPosts) * 100) : 0;

  const filteredPlan = plan.filter(day => {
    if (filterType === 'published') return day.published;
    if (filterType === 'pending') return !day.published;
    return true;
  });

  return (
    <div id="content-plan-tab" className="space-y-6">
      
      {/* Settings Control Panel */}
      <div className="bg-white border border-slate-200/80 rounded-[2rem] p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 font-sans tracking-tight">
            <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
            Генератор публикаций на месяц
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Настройте плотность контента и отслеживайте выполнение плана на 30 дней вперед.
          </p>
        </div>

        {/* Frequency selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Постов в неделю:</span>
          <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200/50">
            {[3, 5, 7].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setPostsPerWeek(num as 3 | 5 | 7)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  postsPerWeek === num 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {num === 7 ? 'Каждый день (7)' : `${num} раза`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Dashboard Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 text-white rounded-[2rem] p-6 shadow-xl flex items-center justify-between col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500 rounded-full blur-2xl opacity-55 -mr-4 -mt-4"></div>
          <div className="space-y-1.5 relative z-10">
            <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest font-mono">Прогресс плана</span>
            <h4 className="text-xl font-sans font-black tracking-tight leading-none">
              Выполнено {publishedPosts} из {totalPosts} постов
            </h4>
            <div className="w-48 sm:w-64 bg-indigo-950/40 rounded-full h-2 overflow-hidden mt-3">
              <div 
                className="bg-emerald-400 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>
          <div className="text-right relative z-10">
            <span className="text-4xl font-sans font-black text-white">{percentComplete}%</span>
            <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-wider mt-1">Завершено</p>
          </div>
        </div>

        {/* Filtering Options */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 font-mono">Фильтр календаря</span>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'all', name: 'Все' },
              { id: 'pending', name: 'В плане' },
              { id: 'published', name: 'Опубл.' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterType(f.id as any)}
                className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                  filterType === f.id 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Month Days List */}
      <div className="space-y-4">
        {filteredPlan.map((day) => {
          const isStoriesOnly = day.postType === 'stories_only';
          const isEditing = editingDay === day.dayNumber;
          const isCopied = copiedDay === day.dayNumber;
          const isExpanded = expandedDay === day.dayNumber;

          return (
            <div 
              key={day.dayNumber}
              id={`plan-day-${day.dayNumber}`}
              className={`border rounded-[2rem] p-6 transition-all bg-white shadow-sm ${
                day.published 
                  ? 'border-emerald-200 bg-emerald-50/5' 
                  : isStoriesOnly 
                    ? 'border-slate-200/80' 
                    : 'border-slate-200 hover:border-slate-350'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-4">
                  {/* Status Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(day.dayNumber)}
                    className="mt-1.5 focus:outline-none flex-shrink-0 cursor-pointer"
                    title={day.published ? 'Отменить публикацию' : 'Пометить как опубликованное'}
                  >
                    {day.published ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-50" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 hover:text-indigo-600 transition-colors" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black text-slate-400 font-mono tracking-wider uppercase">День {day.dayNumber}</span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase font-mono">{day.dayOfWeek}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider ${
                        isStoriesOnly 
                          ? 'bg-amber-50 text-amber-700' 
                          : day.published 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-indigo-50 text-indigo-700'
                      }`}>
                        {day.rubric}
                      </span>
                    </div>

                    <h4 className={`text-sm font-bold leading-relaxed mt-1 ${
                      day.published ? 'text-slate-400 line-through font-medium' : 'text-slate-850 font-extrabold'
                    }`}>
                      {day.topic}
                    </h4>
                  </div>
                </div>

                {/* Operations column */}
                <div className="flex items-center gap-2 sm:self-center self-end mt-2 sm:mt-0">
                  <button
                    type="button"
                    onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                    className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-all cursor-pointer border border-transparent hover:border-slate-200"
                    title={isExpanded ? 'Скрыть детали' : 'Показать детали'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyDay(day)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isCopied 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                        : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
                    }`}
                    title="Копировать в буфер"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Collapsible details / Notes section */}
              {isExpanded && (
                <div className="mt-5 pt-5 border-t border-slate-100 space-y-4 pl-10">
                  <div className="flex items-start gap-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border-l-4 border-indigo-500">
                    <Info className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] font-mono mb-0.5">Рекомендация по контенту:</p>
                      <p className="leading-relaxed text-slate-600 font-medium">
                        {isStoriesOnly 
                          ? 'Уделите время вовлечению аудитории в Сторис. Расскажите о личных планах, покажите рутину или спросите совет.' 
                          : 'Напишите пост на указанную тему. Используйте "Конструктор постов" для составления идеального скелета текста.'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Notes Area */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Мои заметки и тезисы:</span>
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(day.dayNumber, day.notes)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-extrabold cursor-pointer inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Редактировать
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          className="w-full p-4 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans text-slate-700 h-24"
                          placeholder="Запишите идеи, заголовки, ссылки или ссылки на фото..."
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingDay(null)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold hover:bg-slate-50 cursor-pointer text-slate-500 uppercase tracking-wider"
                          >
                            Отмена
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveNotes(day.dayNumber)}
                            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-[10px] font-black hover:bg-indigo-700 cursor-pointer inline-flex items-center gap-1 uppercase tracking-wider"
                          >
                            <Save className="w-3.5 h-3.5" /> Сохранить
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50/50 p-4 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500 min-h-[40px] italic font-medium">
                        {day.notes || 'Нажмите "Редактировать", чтобы добавить заметки, планы, черновики или ссылки к этой публикации.'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
