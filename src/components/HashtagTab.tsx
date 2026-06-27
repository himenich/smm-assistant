/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { HashtagGroup } from '../types';
import { getHashtagsForNiche } from '../data/templates';
import { 
  Hash, 
  Copy, 
  Check, 
  User, 
  Bookmark, 
  Compass, 
  Sparkles,
  ClipboardCheck
} from 'lucide-react';

interface HashtagTabProps {
  selectedNiche: string;
  userName: string;
}

export default function HashtagTab({ selectedNiche, userName }: HashtagTabProps) {
  const hashtagData = getHashtagsForNiche(selectedNiche, userName);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [copiedGroup, setCopiedGroup] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCopyTags = (tags: string[], groupName: string) => {
    navigator.clipboard.writeText(tags.join(' '));
    setCopiedGroup(groupName);
    setTimeout(() => setCopiedGroup(null), 2000);
  };

  const handleCopySelected = () => {
    if (selectedTags.length > 0) {
      navigator.clipboard.writeText(selectedTags.join(' '));
      setCopiedGroup('selected');
      setTimeout(() => setCopiedGroup(null), 2000);
    }
  };

  const handleCopyAll = () => {
    const allTags = [...hashtagData.author, ...hashtagData.thematic, ...hashtagData.navigation];
    navigator.clipboard.writeText(allTags.join(' '));
    setCopiedGroup('all');
    setTimeout(() => setCopiedGroup(null), 2000);
  };

  const renderTagButton = (tag: string) => {
    const isSelected = selectedTags.includes(tag);
    return (
      <button
        key={tag}
        type="button"
        onClick={() => toggleTag(tag)}
        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
          isSelected 
            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
        }`}
      >
        <Hash className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
        {tag.replace('#', '')}
      </button>
    );
  };

  return (
    <div id="hashtag-tab" className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 font-sans tracking-tight">
            <Hash className="w-5 h-5 text-indigo-600" />
            Конструктор хэштегов
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            Хэштеги помогают алгоритмам правильно категоризировать ваш пост и привлекать целевых читателей. 
            Мы подготовили три группы тегов под вашу нишу. Кликайте на теги для сборки своего набора!
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleCopyAll}
            className={`px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              copiedGroup === 'all'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {copiedGroup === 'all' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedGroup === 'all' ? 'Все скопированы!' : 'Скопировать все'}
          </button>
        </div>
      </div>

      {/* Dynamic Construction Sandbox Drawer */}
      <div className="bg-slate-50 border border-slate-150 rounded-[2rem] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4.5 h-4.5 text-indigo-600" />
            <h4 className="font-black text-slate-900 text-sm tracking-tight">Сборка вашего набора тегов</h4>
          </div>
          {selectedTags.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedTags([])}
                className="text-[10px] text-slate-400 hover:text-slate-600 font-black uppercase tracking-wider cursor-pointer"
              >
                Очистить
              </button>
              <button
                type="button"
                onClick={handleCopySelected}
                className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  copiedGroup === 'selected'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {copiedGroup === 'selected' ? <ClipboardCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedGroup === 'selected' ? 'Набор скопирован!' : `Скопировать (${selectedTags.length})`}
              </button>
            </div>
          )}
        </div>

        {selectedTags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 p-4 bg-white rounded-2xl border border-slate-200/50">
            {selectedTags.map(tag => (
              <span 
                key={tag}
                onClick={() => toggleTag(tag)}
                className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer hover:bg-indigo-100 transition-colors border border-indigo-100"
              >
                {tag}
                <span className="text-[10px] text-indigo-400 font-bold ml-1">×</span>
              </span>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs italic bg-white rounded-2xl border border-dashed border-slate-200 font-medium">
            Кликните по любым хэштегам ниже, чтобы собрать свой уникальный набор для публикации.
          </div>
        )}
      </div>

      {/* Hashtag Categories Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Category 1: Author tags */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between min-h-[240px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-slate-800">
                <User className="w-4.5 h-4.5 text-slate-500" />
                <h4 className="font-extrabold text-sm text-slate-850 tracking-tight">Брендовые (Авторские)</h4>
              </div>
              <button
                type="button"
                onClick={() => handleCopyTags(hashtagData.author, 'author')}
                className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100"
                title="Копировать группу"
              >
                {copiedGroup === 'author' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-4 font-semibold">
              Используются для формирования личного бренда и быстрой навигации по вашим личным рубрикам.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {hashtagData.author.map(renderTagButton)}
            </div>
          </div>
        </div>

        {/* Category 2: Thematic tags */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between min-h-[240px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-slate-800">
                <Bookmark className="w-4.5 h-4.5 text-slate-500" />
                <h4 className="font-extrabold text-sm text-slate-850 tracking-tight">Тематические</h4>
              </div>
              <button
                type="button"
                onClick={() => handleCopyTags(hashtagData.thematic, 'thematic')}
                className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100"
                title="Копировать группу"
              >
                {copiedGroup === 'thematic' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-4 font-semibold">
              Теги по вашей специализации, помогающие соцсетям показывать ваш пост заинтересованным людям.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {hashtagData.thematic.map(renderTagButton)}
            </div>
          </div>
        </div>

        {/* Category 3: Navigation tags */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between min-h-[240px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-slate-800">
                <Compass className="w-4.5 h-4.5 text-slate-500" />
                <h4 className="font-extrabold text-sm text-slate-850 tracking-tight">Навигационные</h4>
              </div>
              <button
                type="button"
                onClick={() => handleCopyTags(hashtagData.navigation, 'navigation')}
                className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100"
                title="Копировать группу"
              >
                {copiedGroup === 'navigation' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-4 font-semibold">
              Общие популярные теги, облегчающие пользователям поиск полезных рубрик и экспертных кейсов.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {hashtagData.navigation.map(renderTagButton)}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
