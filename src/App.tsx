/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Share2, 
  Lightbulb, 
  Calendar, 
  FileText, 
  Layers, 
  Hash, 
  CheckSquare, 
  Zap, 
  BookOpen, 
  Settings,
  LogOut,
  User,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

// Import Types
import { Platform } from './types';

// Import Components
import Onboarding from './components/Onboarding';
import RubricatorTab from './components/RubricatorTab';
import ContentPlanTab from './components/ContentPlanTab';
import PostBuilderTab from './components/PostBuilderTab';
import AdapterTab from './components/AdapterTab';
import HashtagTab from './components/HashtagTab';
import ChecklistTab from './components/ChecklistTab';
import RemindersAndStatsTab from './components/RemindersAndStatsTab';
import TemplatesDbTab from './components/TemplatesDbTab';

type TabId = 'rubrics' | 'plan' | 'builder' | 'adapter' | 'hashtags' | 'checklist' | 'reminders' | 'database';

export default function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [selectedNiche, setSelectedNiche] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('rubrics');
  const [planCompletedCount, setPlanCompletedCount] = useState(0);
  const [planTotalCount, setPlanTotalCount] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load state from local storage on mount
  useEffect(() => {
    const savedNiche = localStorage.getItem('smm_niche');
    const savedPlatforms = localStorage.getItem('smm_platforms');
    const savedName = localStorage.getItem('smm_username');
    const savedOnboarded = localStorage.getItem('smm_onboarded');

    if (savedOnboarded === 'true' && savedNiche && savedPlatforms) {
      setSelectedNiche(savedNiche);
      setSelectedPlatforms(JSON.parse(savedPlatforms) as Platform[]);
      setUserName(savedName || 'Эксперт');
      setIsOnboarded(true);
    }
  }, []);

  const handleOnboardingComplete = (niche: string, platforms: Platform[], name: string) => {
    setSelectedNiche(niche);
    setSelectedPlatforms(platforms);
    setUserName(name);
    setIsOnboarded(true);

    localStorage.setItem('smm_niche', niche);
    localStorage.setItem('smm_platforms', JSON.stringify(platforms));
    localStorage.setItem('smm_username', name);
    localStorage.setItem('smm_onboarded', 'true');
  };

  const handleResetApp = () => {
    setShowResetConfirm(true);
  };

  const executeResetApp = () => {
    localStorage.removeItem('smm_niche');
    localStorage.removeItem('smm_platforms');
    localStorage.removeItem('smm_username');
    localStorage.removeItem('smm_onboarded');
    localStorage.removeItem('smm_activity_stats');
    localStorage.removeItem('smm_reminders');
    
    setIsOnboarded(false);
    setSelectedNiche('');
    setSelectedPlatforms([]);
    setUserName('');
    setActiveTab('rubrics');
    setShowResetConfirm(false);
  };

  const handleTabChange = (id: TabId) => {
    setActiveTab(id);
  };

  // Reset scroll of viewport when tab changes
  useEffect(() => {
    const viewport = document.getElementById('active-viewport');
    if (viewport) {
      viewport.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  // List of SMM Dashboard tabs with localized titles, icons, and categories
  const tabsList: { id: TabId; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'rubrics', label: 'Рубрикатор', icon: <Lightbulb className="w-4 h-4" />, desc: 'Авто-рубрики под вашу нишу' },
    { id: 'plan', label: 'Контент-План', icon: <Calendar className="w-4 h-4" />, desc: '30-дневный календарь' },
    { id: 'builder', label: 'Конструктор постов', icon: <FileText className="w-4 h-4" />, desc: 'Формулы и структуры текстов' },
    { id: 'adapter', label: 'Адаптер постов', icon: <Layers className="w-4 h-4" />, desc: 'Тюнинг под разные соцсети' },
    { id: 'hashtags', label: 'Хэштеги', icon: <Hash className="w-4 h-4" />, desc: 'Подбор брендовых и тематических тегов' },
    { id: 'checklist', label: 'Чек-лист аккаунта', icon: <CheckSquare className="w-4 h-4" />, desc: 'Готовность профиля к продажам' },
    { id: 'reminders', label: 'Задачи и Статистика', icon: <Zap className="w-4 h-4" />, desc: 'Распорядок дня и автопилот активности' },
    { id: 'database', label: 'База шаблонов', icon: <BookOpen className="w-4 h-4" />, desc: '290 готовых материалов' }
  ];

  const activeTabObj = tabsList.find(t => t.id === activeTab);

  return (
    <div id="app-viewport" className="min-h-screen bg-slate-100 text-slate-900 antialiased font-sans flex flex-col">
      <AnimatePresence mode="wait">
        
        {!isOnboarded ? (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 animate-fade-in"
          >
            <Onboarding onComplete={handleOnboardingComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col max-w-7xl w-full mx-auto"
            id="workspace-layout"
          >
            {/* Navigation Header */}
            <header id="main-header" className="px-4 md:px-8 py-4 flex flex-col gap-4 sticky top-0 z-30 bg-slate-100/95 backdrop-blur-md border-b border-slate-200/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black tracking-tighter text-indigo-700 font-sans">САМ СЕБЕ SMM</h1>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 font-mono">Ваш интерактивный контент-помощник</p>
                </div>

                {/* Status parameters indicator and settings */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-[1.5rem] border border-slate-200 shadow-sm">
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-900">Ниша: {selectedNiche}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider font-mono">Автор: {userName}</p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-150">
                      <span className="text-indigo-600 font-black text-xs font-mono">{userName.substring(0, 2).toUpperCase()}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetApp}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-rose-600 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black uppercase tracking-wider shadow-sm"
                    title="Сменить нишу / Начать заново"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Сбросить</span>
                  </button>
                </div>
              </div>

              {/* Mobile Dropdown Navigation (Visible only on mobile/tablet) */}
              <div className="md:hidden w-full pt-1">
                <label htmlFor="mobile-tab-select" className="block text-[10px] font-black uppercase tracking-widest text-indigo-700/80 font-sans mb-1.5 ml-1">
                  Меню SMM-инструментов (нажмите для смены раздела):
                </label>
                <div className="relative flex items-center bg-white border border-slate-200 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                  <div className="pl-4 text-indigo-600 flex items-center justify-center pointer-events-none">
                    {activeTabObj?.icon}
                  </div>
                  <select
                    id="mobile-tab-select"
                    value={activeTab}
                    onChange={(e) => handleTabChange(e.target.value as TabId)}
                    className="w-full bg-transparent text-slate-800 pl-3 pr-10 py-3 rounded-xl text-xs font-black uppercase tracking-wider focus:outline-none appearance-none cursor-pointer font-sans"
                  >
                    {tabsList.map(tab => (
                      <option key={tab.id} value={tab.id}>
                        {tab.label} — {tab.desc}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </header>

            {/* Main workspace container */}
            <div id="main-container" className="flex-1 flex flex-col md:flex-row gap-6 px-4 md:px-8 pb-8">
              
              {/* Desktop Sidebar navigation */}
              <aside id="sidebar-nav" className="hidden md:flex w-full md:w-64 bg-white border border-slate-200 rounded-[2rem] p-6 flex-col justify-between shadow-sm flex-shrink-0">
                <div className="space-y-1">
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2 font-mono">Консоль управления</span>
                  
                  <nav className="space-y-1.5">
                    {tabsList.map(tab => {
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => handleTabChange(tab.id)}
                          className={`w-full flex items-start gap-3 p-3 rounded-2xl text-left transition-all cursor-pointer border ${
                            isActive 
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                              : 'bg-white border-transparent hover:border-slate-100 hover:bg-slate-50/70 text-slate-600'
                          }`}
                        >
                          <div className={`mt-0.5 p-1 rounded-lg ${isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {tab.icon}
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <h4 className="text-xs font-black tracking-tight truncate">{tab.label}</h4>
                            <p className={`text-[10px] truncate font-medium ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                              {tab.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Sidebar footer mini-summary */}
                <div className="hidden md:block pt-6 mt-6 border-t border-slate-150 space-y-3">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>План постов</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                      Выполнено {planCompletedCount} из {planTotalCount} запланированных на этот месяц.
                    </p>
                  </div>
                  <div className="text-[9px] font-black text-slate-400 text-center font-mono uppercase tracking-widest">
                    Сам себе SMM v1.1.0
                  </div>
                </div>
              </aside>

              {/* Central active screen viewport */}
              <main id="active-viewport" className="flex-1 overflow-y-auto max-w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="h-full space-y-6"
                  >
                    {activeTab === 'rubrics' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shadow-sm">
                            <Lightbulb className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">1. Рубрикатор постов</h3>
                            <p className="text-[10px] text-slate-400 font-bold">Рекомендованные рубрики под вашу нишу</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-sm p-4 md:p-6">
                          <RubricatorTab 
                            selectedNiche={selectedNiche} 
                            onTabChange={(tabId) => handleTabChange(tabId)}
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === 'plan' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shadow-sm">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">2. Контент-План</h3>
                            <p className="text-[10px] text-slate-400 font-bold">Интерактивный контент-план на 30 дней</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-sm p-4 md:p-6">
                          <ContentPlanTab 
                            selectedNiche={selectedNiche} 
                            onPlanProgressChange={(published, total) => {
                              setPlanCompletedCount(published);
                              setPlanTotalCount(total);
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === 'builder' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shadow-sm">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">3. Конструктор постов</h3>
                            <p className="text-[10px] text-slate-400 font-bold">Формулы и структуры продающих постов</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-sm p-4 md:p-6">
                          <PostBuilderTab />
                        </div>
                      </div>
                    )}

                    {activeTab === 'adapter' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shadow-sm">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">4. Адаптер под соцсети</h3>
                            <p className="text-[10px] text-slate-400 font-bold">Форматирование контента под выбранные медиа</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-sm p-4 md:p-6">
                          <AdapterTab selectedPlatforms={selectedPlatforms} />
                        </div>
                      </div>
                    )}

                    {activeTab === 'hashtags' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shadow-sm">
                            <Hash className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">5. Генератор хэштегов</h3>
                            <p className="text-[10px] text-slate-400 font-bold">Ключевые слова для органического охвата</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-sm p-4 md:p-6">
                          <HashtagTab selectedNiche={selectedNiche} userName={userName} />
                        </div>
                      </div>
                    )}

                    {activeTab === 'checklist' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shadow-sm">
                            <CheckSquare className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">6. Чек-лист профиля</h3>
                            <p className="text-[10px] text-slate-400 font-bold">Готовность аккаунта к продажам</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-sm p-4 md:p-6">
                          <ChecklistTab selectedNiche={selectedNiche} />
                        </div>
                      </div>
                    )}

                    {activeTab === 'reminders' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shadow-sm">
                            <Zap className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">7. Распорядок и активность</h3>
                            <p className="text-[10px] text-slate-400 font-bold">Ежедневный план задач и отслеживание статистики</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-sm p-4 md:p-6">
                          <RemindersAndStatsTab />
                        </div>
                      </div>
                    )}

                    {activeTab === 'database' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shadow-sm">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">8. База шаблонов постов</h3>
                            <p className="text-[10px] text-slate-400 font-bold">290 готовых заголовков и шаблонов постов</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-sm p-4 md:p-6">
                          <TemplatesDbTab selectedNiche={selectedNiche} />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </main>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl p-6 max-w-md w-full space-y-6 text-center animate-fade-in"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                <LogOut className="w-6 h-6" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 tracking-tight font-sans">Сбросить настройки?</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Вы действительно хотите изменить нишу и сбросить текущие настройки продвижения? Все ваши локальные изменения будут сброшены.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={executeResetApp}
                  className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-rose-600/10 hover:shadow-rose-600/20 transition-all cursor-pointer"
                >
                  Да, сбросить
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
