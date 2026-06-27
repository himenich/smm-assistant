/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  Check, 
  Layers, 
  HeartPulse, 
  TrendingUp, 
  Video, 
  Scissors, 
  Award, 
  BookOpen, 
  ShoppingBag,
  Share2
} from 'lucide-react';
import { NICHE_CATEGORIES } from '../data/templates';
import { Platform } from '../types';

interface OnboardingProps {
  onComplete: (selectedNiche: string, selectedPlatforms: Platform[], userName: string) => void;
}

// Map categories to visual icons and colors
const CATEGORY_META: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  practices: { 
    icon: <HeartPulse className="w-5 h-5" />, 
    color: 'text-rose-500 border-rose-100', 
    bg: 'bg-rose-50' 
  },
  mlm: { 
    icon: <Layers className="w-5 h-5" />, 
    color: 'text-amber-500 border-amber-100', 
    bg: 'bg-amber-50' 
  },
  digital: { 
    icon: <TrendingUp className="w-5 h-5" />, 
    color: 'text-indigo-500 border-indigo-100', 
    bg: 'bg-indigo-50' 
  },
  visual: { 
    icon: <Video className="w-5 h-5" />, 
    color: 'text-violet-500 border-violet-100', 
    bg: 'bg-violet-50' 
  },
  beauty_offline: { 
    icon: <Scissors className="w-5 h-5" />, 
    color: 'text-emerald-500 border-emerald-100', 
    bg: 'bg-emerald-50' 
  },
  mentors: { 
    icon: <Award className="w-5 h-5" />, 
    color: 'text-blue-500 border-blue-100', 
    bg: 'bg-blue-50' 
  },
  schools: { 
    icon: <BookOpen className="w-5 h-5" />, 
    color: 'text-purple-500 border-purple-100', 
    bg: 'bg-purple-50' 
  },
  products: { 
    icon: <ShoppingBag className="w-5 h-5" />, 
    color: 'text-sky-500 border-sky-100', 
    bg: 'bg-sky-50' 
  }
};

const PLATFORMS_META: { id: Platform; name: string; color: string; bg: string; text: string }[] = [
  { id: 'vk', name: 'ВКонтакте', color: 'bg-blue-600 hover:bg-blue-700', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
  { id: 'telegram', name: 'Telegram', color: 'bg-sky-500 hover:bg-sky-600', bg: 'bg-sky-50 border-sky-200', text: 'text-sky-700' },
  { id: 'instagram', name: 'Instagram', color: 'bg-pink-600 hover:bg-pink-700', bg: 'bg-pink-50 border-pink-200', text: 'text-pink-700' },
  { id: 'ok', name: 'Одноклассники', color: 'bg-orange-500 hover:bg-orange-600', bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700' },
  { id: 'zen', name: 'Дзен', color: 'bg-neutral-900 hover:bg-neutral-800', bg: 'bg-neutral-100 border-neutral-300', text: 'text-neutral-800' }
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [userName, setUserName] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['vk', 'telegram', 'instagram']);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleNextStep = () => {
    if (step === 1 && userName.trim()) setStep(2);
    else if (step === 2 && selectedNiche) setStep(3);
  };

  const handleBackStep = () => {
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const handlePlatformToggle = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleComplete = () => {
    if (selectedNiche && selectedPlatforms.length > 0) {
      onComplete(selectedNiche, selectedPlatforms, userName.trim() || 'Эксперт');
    }
  };

  // Filter sub-niches based on search query
  const filteredCategories = NICHE_CATEGORIES.map(category => {
    const matchedSubNiches = category.subNiches.filter(sub => 
      sub.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return {
      ...category,
      subNiches: matchedSubNiches
    };
  }).filter(category => category.subNiches.length > 0);

  return (
    <div id="onboarding-container" className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div id="onboarding-card" className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden min-h-[550px] flex flex-col md:flex-row">
        
        {/* Sidebar Decor / Branding */}
        <div id="onboarding-sidebar" className="md:w-1/3 bg-indigo-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900 to-violet-800 opacity-90" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-400/30">
                <Share2 className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="font-sans font-black tracking-tight text-lg">Сам себе SMM</span>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step >= 1 ? 'bg-indigo-400 text-slate-900' : 'bg-indigo-900 text-indigo-400 border border-indigo-700'}`}>1</div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight">Старт</h4>
                  <p className="text-xs text-indigo-300 font-medium">Знакомство и имя</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step >= 2 ? 'bg-indigo-400 text-slate-900' : 'bg-indigo-900 text-indigo-400 border border-indigo-700'}`}>2</div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight">Ниша эксперта</h4>
                  <p className="text-xs text-indigo-300 font-medium">Выбор сферы деятельности</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step >= 3 ? 'bg-indigo-400 text-slate-900' : 'bg-indigo-900 text-indigo-400 border border-indigo-700'}`}>3</div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight">Площадки</h4>
                  <p className="text-xs text-indigo-300 font-medium">Каналы продвижения</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-indigo-300 border-t border-indigo-900 pt-6 mt-8 md:mt-0 font-medium">
            ⚡️ 100% контент-структуры строятся по готовым сценариям и проверенной логике без ИИ.
          </div>
        </div>

        {/* Dynamic content screen */}
        <div id="onboarding-main" className="flex-1 p-6 md:p-10 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            
            {/* Screen 1: Welcome & Start */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col justify-center py-6"
                id="welcome-step"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest font-mono mb-4 w-fit">
                  <Sparkles className="w-3.5 h-3.5" /> Настольный органайзер эксперта
                </div>

                <h1 className="text-3xl font-sans font-black text-slate-900 tracking-tight leading-tight mb-4">
                  Добро пожаловать в «Сам себе SMM»
                </h1>
                
                <p className="text-base text-slate-600 font-medium mb-8 leading-relaxed">
                  Создай систему продвижения за 10 минут и перестань думать каждый день: 
                  <span className="block mt-1 font-black text-indigo-600">"Что сегодня публиковать?"</span>
                </p>

                <div className="mb-8 max-w-md">
                  <label htmlFor="user-name-input" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-1.5">
                    Ваше имя или название бренда * <span className="text-rose-500 text-xs font-bold">(Обязательно)</span>
                  </label>
                  <input
                    type="text"
                    id="user-name-input"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-sans text-xs font-bold text-slate-900"
                    placeholder="Например: Мария, Кофейня «Бодрый день»"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                  <p className="text-[10px] text-slate-500 font-semibold mt-2 leading-relaxed">
                    💡 Эти данные автоматически встраиваются в подписи постов и формулы хэштегов (например, <span className="font-mono">#Мария</span> или <span className="font-mono">#КофейняБодрыйДень</span>). Рекомендуем указать точное название вашего личного бренда или компании.
                  </p>
                </div>

                <div>
                  <button
                    id="welcome-start-button"
                    disabled={!userName.trim()}
                    onClick={handleNextStep}
                    className={`inline-flex items-center gap-2 px-8 py-3.5 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 ${
                      userName.trim() 
                        ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed transform-none'
                    }`}
                  >
                    Начать работу 👉
                  </button>
                </div>
              </motion.div>
            )}

            {/* Screen 2: Niche Selection */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
                id="niche-step"
              >
                <div>
                  <h2 className="text-2xl font-sans font-black text-slate-900 tracking-tight mb-2">
                    Выберите вашу нишу
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold mb-6">
                    На основе ниши мы автоматически настроим контент-рубрикатор, темы постов, хэштеги и формулы публикаций.
                  </p>

                  {/* Search input */}
                  <div className="relative mb-6">
                    <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-sans text-xs font-bold"
                      placeholder="Поиск вашей подниши (например: Психолог, Дизайнер, Кофейня...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Categories and sub-niches */}
                <div className="flex-1 max-h-[320px] overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map(cat => {
                      const meta = CATEGORY_META[cat.id] || { icon: <Layers className="w-5 h-5" />, color: 'text-indigo-500', bg: 'bg-indigo-50' };
                      const isExpanded = expandedCategory === cat.id || searchQuery.length > 0;

                      return (
                        <div key={cat.id} className="border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                          {/* Header */}
                          <button
                            type="button"
                            onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/70 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-xl ${meta.bg} ${meta.color.split(' ')[0]}`}>
                                {meta.icon}
                              </div>
                              <span className="font-bold text-slate-800 text-sm">{cat.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-black font-mono">
                              {cat.subNiches.length} {cat.subNiches.length === 1 ? 'НАПРАВЛЕНИЕ' : 'НАПРАВЛЕНИЙ'}
                            </span>
                          </button>

                          {/* Sub-niches List */}
                          {isExpanded && (
                            <div className="p-4 bg-white grid grid-cols-2 sm:grid-cols-3 gap-2 border-t border-slate-150">
                              {cat.subNiches.map(sub => {
                                const isSelected = selectedNiche === sub;
                                return (
                                  <button
                                    key={sub}
                                    type="button"
                                    onClick={() => setSelectedNiche(sub)}
                                    className={`px-3 py-2.5 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer flex items-center justify-between ${
                                      isSelected 
                                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 ring-2 ring-indigo-500/10' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-50'
                                    }`}
                                  >
                                    <span className="truncate">{sub}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 ml-1" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-sm font-semibold">
                      Ничего не найдено по вашему запросу. Попробуйте поискать более короткое слово.
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between border-t border-slate-150 pt-6">
                  <button
                    type="button"
                    onClick={handleBackStep}
                    className="px-5 py-2.5 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Назад
                  </button>

                  <div className="flex items-center gap-3">
                    {selectedNiche && (
                      <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
                        Выбрано: <strong className="text-indigo-600 font-black">{selectedNiche}</strong>
                      </span>
                    )}
                    <button
                      type="button"
                      disabled={!selectedNiche}
                      onClick={handleNextStep}
                      className={`inline-flex items-center gap-1.5 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                        selectedNiche 
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Продолжить <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Screen 3: Social Media Selection */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col justify-between"
                id="platforms-step"
              >
                <div>
                  <h2 className="text-2xl font-sans font-black text-slate-900 tracking-tight mb-2">
                    Выберите ваши площадки
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold mb-6">
                    Укажите, в каких социальных сетях и блогах вы продвигаетесь. Мы настроим адаптер постов под их специфику.
                  </p>

                  <div className="space-y-3 mb-8">
                    {PLATFORMS_META.map(p => {
                      const isChecked = selectedPlatforms.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handlePlatformToggle(p.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-[1.5rem] border transition-all cursor-pointer text-left ${
                            isChecked 
                              ? `${p.bg} shadow-sm ring-1 ring-offset-0 ring-indigo-500/20 border-indigo-200` 
                              : 'bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                              isChecked 
                                ? 'bg-indigo-600 border-indigo-600 text-white' 
                                : 'border-slate-300 bg-white'
                            }`}>
                              {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <span className="font-bold text-slate-800 text-sm">{p.name}</span>
                          </div>

                          <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${isChecked ? p.text + ' bg-white/60' : 'bg-slate-100 text-slate-500'}`}>
                            {p.id === 'telegram' ? 'Мессенджер' : p.id === 'zen' ? 'Блог-платформа' : 'Социальная сеть'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-150 pt-6">
                  <button
                    type="button"
                    onClick={handleBackStep}
                    className="px-5 py-2.5 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Назад
                  </button>

                  <button
                    type="button"
                    disabled={selectedPlatforms.length === 0}
                    onClick={handleComplete}
                    className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer ${
                      selectedPlatforms.length > 0 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Запустить Помощник 🚀
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
