/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { getNicheTemplatesDatabase } from '../data/templates';
import { 
  Lightbulb, 
  Copy, 
  Check, 
  Search, 
  Tag, 
  Sparkles, 
  Flame, 
  MessageSquare, 
  Video, 
  Type, 
  Megaphone,
  Filter
} from 'lucide-react';

interface TemplatesDbTabProps {
  selectedNiche: string;
}

type CategoryType = 'ideas' | 'sales' | 'engaging' | 'stories' | 'headings' | 'calls';

export default function TemplatesDbTab({ selectedNiche }: TemplatesDbTabProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('ideas');
  const [searchQuery, setSearchQuery] = useState('');
  const [subFilter, setSubFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const db = getNicheTemplatesDatabase(selectedNiche);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Setup sub-filters for ideas (since there are 100 ideas!)
  const getIdeasSubFilter = (idx: number): 'tips' | 'cases' | 'brand' | 'engaging' | 'selling' => {
    if (idx < 20) return 'tips';      // 0-19: Tips & Expert
    if (idx < 40) return 'cases';     // 20-39: Cases
    if (idx < 60) return 'brand';     // 40-59: Brand/Personal
    if (idx < 80) return 'engaging';  // 60-79: Engaging
    return 'selling';                 // 80-99: Selling
  };

  const getFilteredData = () => {
    const query = searchQuery.toLowerCase().trim();

    if (activeCategory === 'ideas') {
      return db.ideas.map((text, idx) => ({ id: `idea-${idx}`, text, type: getIdeasSubFilter(idx) }))
        .filter(item => {
          const matchesSearch = item.text.toLowerCase().includes(query);
          const matchesFilter = subFilter === 'all' || item.type === subFilter;
          return matchesSearch && matchesFilter;
        });
    }

    if (activeCategory === 'sales') {
      return db.sales.map((item, idx) => ({ id: `sales-${idx}`, title: item.title, text: item.text }))
        .filter(item => item.title.toLowerCase().includes(query) || item.text.toLowerCase().includes(query));
    }

    if (activeCategory === 'engaging') {
      return db.engaging.map((item, idx) => ({ id: `engaging-${idx}`, title: item.title, text: item.text }))
        .filter(item => item.title.toLowerCase().includes(query) || item.text.toLowerCase().includes(query));
    }

    if (activeCategory === 'stories') {
      return db.stories.map((item, idx) => ({ id: `stories-${idx}`, title: item.title, text: item.text }))
        .filter(item => item.title.toLowerCase().includes(query) || item.text.toLowerCase().includes(query));
    }

    if (activeCategory === 'headings') {
      return db.headings.map((text, idx) => ({ id: `heading-${idx}`, text }))
        .filter(item => item.text.toLowerCase().includes(query));
    }

    // calls to action
    return db.calls.map((text, idx) => ({ id: `call-${idx}`, text }))
      .filter(item => item.text.toLowerCase().includes(query));
  };

  const items = getFilteredData();

  // Categories helper list
  const categoryTabs: { id: CategoryType; label: string; count: number; icon: React.ReactNode; color: string }[] = [
    { id: 'ideas', label: 'Идеи постов', count: 100, icon: <Lightbulb className="w-4 h-4" />, color: 'indigo' },
    { id: 'sales', label: 'Продающие', count: 30, icon: <Flame className="w-4 h-4" />, color: 'rose' },
    { id: 'engaging', label: 'Вовлекающие', count: 30, icon: <MessageSquare className="w-4 h-4" />, color: 'emerald' },
    { id: 'stories', label: 'Сюжеты сторис', count: 30, icon: <Video className="w-4 h-4" />, color: 'amber' },
    { id: 'headings', label: 'Заголовки', count: 50, icon: <Type className="w-4 h-4" />, color: 'sky' },
    { id: 'calls', label: 'Призывы', count: 50, icon: <Megaphone className="w-4 h-4" />, color: 'purple' }
  ];

  return (
    <div id="templates-db-tab" className="space-y-6">
      
      {/* Intro details card */}
      <div className="bg-indigo-600 text-white p-6 rounded-[2rem] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500 rounded-full blur-3xl opacity-50 -mr-6 -mt-6"></div>
        <div className="relative z-10 space-y-1.5 flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-[10px] text-indigo-100 font-black uppercase tracking-wider mb-1 font-mono">
            <Sparkles className="w-3.5 h-3.5" /> Библиотека на 290 готовых SMM-ресурсов
          </div>
          <h3 className="text-xl font-black tracking-tight font-sans">База шаблонов и контент-идей</h3>
          <p className="text-xs text-indigo-100 max-w-2xl leading-relaxed font-semibold">
            Мы полностью исключили необходимость ИИ, собрав 290 проверенных, готовых к копированию заголовков, 
            призывов к действию, сценариев и тем постов, которые адаптированы под вашу нишу. Изучайте, ищите и копируйте!
          </p>
        </div>
      </div>

      {/* Main Tab Switcher bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-150 pb-4">
        {categoryTabs.map(tab => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveCategory(tab.id);
                setSearchQuery('');
                setSubFilter('all');
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isActive 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-600/10' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span className="font-bold">{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black font-mono ${
                isActive ? 'bg-indigo-800 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Control Panel: Search & Sub-filters */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-5 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        
        {/* Search Input bar */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans text-xs font-bold"
            placeholder="Быстрый поиск по базе..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Dynamic Sub-filters based on active category */}
        {activeCategory === 'ideas' && (
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-[10px] font-black text-slate-400 flex items-center gap-1 whitespace-nowrap uppercase tracking-wider font-mono"><Filter className="w-3.5 h-3.5" /> Фильтр:</span>
            {[
              { id: 'all', name: 'Все (100)' },
              { id: 'tips', name: '💡 Полезные (20)' },
              { id: 'cases', name: '📈 Кейсы (20)' },
              { id: 'brand', name: '📖 Личный бренд (20)' },
              { id: 'engaging', name: '💬 Интерактивы (20)' },
              { id: 'selling', name: '💎 Продающие (20)' }
            ].map(filter => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSubFilter(filter.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                  subFilter === filter.id 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                    : 'bg-slate-50 border-slate-150 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid rendering list of assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.length > 0 ? (
          items.map((item: any, idx) => {
            const isCopied = copiedId === item.id;
            const fullText = item.text || item.title + '\n\n' + item.text;

            return (
              <div 
                key={item.id}
                id={`db-card-${item.id}`}
                className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-4">
                    
                    {/* Visual Card Headers / Categories icons */}
                    <div className="space-y-0.5">
                      {activeCategory === 'ideas' && (
                        <span className="inline-block text-[9px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 font-mono">
                          {item.type === 'tips' && '💡 Польза и советы'}
                          {item.type === 'cases' && '📈 Разбор кейсов'}
                          {item.type === 'brand' && '📖 Бренд автора'}
                          {item.type === 'engaging' && '💬 Вовлечение'}
                          {item.type === 'selling' && '💎 Продажи'}
                        </span>
                      )}
                      
                      {item.title ? (
                        <h4 className="font-extrabold text-slate-900 text-xs tracking-tight uppercase mb-1">{item.title}</h4>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-400 text-xs font-bold mb-2">
                          <Tag className="w-3.5 h-3.5" />
                          <span>Шаблон #{idx + 1}</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(fullText, item.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex-shrink-0 ${
                        isCopied 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                          : 'bg-white border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200'
                      }`}
                      title="Копировать в буфер"
                    >
                      {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className={`text-slate-700 leading-relaxed font-sans text-xs font-semibold whitespace-pre-wrap ${
                    activeCategory === 'headings' ? 'font-black text-slate-900 font-sans text-sm tracking-tight' : ''
                  }`}>
                    {item.text || fullText}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 text-slate-400 text-sm font-semibold col-span-2">
            Ничего не найдено по вашему поисковому запросу. Попробуйте ввести другое слово.
          </div>
        )}
      </div>

    </div>
  );
}
