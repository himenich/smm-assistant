/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ReminderItem, ActivityStats } from '../types';
import { 
  CheckCircle, 
  Circle, 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  Zap, 
  Plus, 
  Minus,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';

export default function RemindersAndStatsTab() {
  // Screen 10: Daily Reminders
  const [reminders, setReminders] = useState<ReminderItem[]>([
    { id: 'post', text: '📌 Опубликовать пост', completed: false },
    { id: 'comments', text: '📌 Ответить на комментарии', completed: false },
    { id: 'reels', text: '📌 Записать рилс', completed: false },
    { id: 'stats', text: '📌 Проверить статистику', completed: false },
    { id: 'stories', text: '📌 Сделать сторис', completed: false }
  ]);

  // Screen 11: Activity Tracker
  const [stats, setStats] = useState<ActivityStats>({
    postsThisWeek: 0,
    storiesThisWeek: 0,
    daysWithoutContent: 0,
    activityPercentage: 0
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedReminders = localStorage.getItem('smm_reminders');
    if (savedReminders) {
      try { setReminders(JSON.parse(savedReminders)); } catch (e) {}
    }

    const savedStats = localStorage.getItem('smm_activity_stats');
    if (savedStats) {
      try { setStats(JSON.parse(savedStats)); } catch (e) {}
    } else {
      // Initialize with empty stats if not present in localStorage
      saveStats({
        postsThisWeek: 0,
        storiesThisWeek: 0,
        daysWithoutContent: 0,
        activityPercentage: 0
      });
    }
  }, []);

  const saveReminders = (updated: ReminderItem[]) => {
    setReminders(updated);
    localStorage.setItem('smm_reminders', JSON.stringify(updated));
  };

  const saveStats = (updated: ActivityStats) => {
    setStats(updated);
    localStorage.setItem('smm_activity_stats', JSON.stringify(updated));
  };

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map(r => {
      if (r.id === id) {
        return { ...r, completed: !r.completed };
      }
      return r;
    });
    saveReminders(updated);

    // Dynamic tie-in: completing "Publish post" or "Make stories" boosts stats!
    const item = reminders.find(r => r.id === id);
    if (item) {
      const isNowCompleted = !item.completed;
      let postsDiff = 0;
      let storiesDiff = 0;

      if (id === 'post') {
        postsDiff = isNowCompleted ? 1 : -1;
      } else if (id === 'stories') {
        storiesDiff = isNowCompleted ? 1 : -1;
      }

      const newPosts = Math.max(0, stats.postsThisWeek + postsDiff);
      const newStories = Math.max(0, stats.storiesThisWeek + storiesDiff);
      
      let newDaysOff = stats.daysWithoutContent;
      if (isNowCompleted && (id === 'post' || id === 'stories')) {
        newDaysOff = 0;
      }

      recalculateStats(newPosts, newStories, newDaysOff);
    }
  };

  const handleResetReminders = () => {
    // When resetting the checklist, we also want to deduct checklist-related boosts if they were active
    const oldPostCompleted = reminders.find(r => r.id === 'post')?.completed;
    const oldStoriesCompleted = reminders.find(r => r.id === 'stories')?.completed;

    let postsDiff = oldPostCompleted ? -1 : 0;
    let storiesDiff = oldStoriesCompleted ? -1 : 0;

    const reset = reminders.map(r => ({ ...r, completed: false }));
    saveReminders(reset);

    const newPosts = Math.max(0, stats.postsThisWeek + postsDiff);
    const newStories = Math.max(0, stats.storiesThisWeek + storiesDiff);
    recalculateStats(newPosts, newStories, stats.daysWithoutContent);
  };

  // Helper counters
  const handleAddPost = () => {
    const newPosts = stats.postsThisWeek + 1;
    recalculateStats(newPosts, stats.storiesThisWeek, 0);
  };

  const handleAddStory = () => {
    const newStories = stats.storiesThisWeek + 1;
    recalculateStats(stats.postsThisWeek, newStories, stats.daysWithoutContent);
  };

  const handleIncrementDaysWithoutContent = () => {
    const newDays = Math.min(stats.daysWithoutContent + 1, 7);
    recalculateStats(stats.postsThisWeek, stats.storiesThisWeek, newDays);
  };

  const handleDecrementDaysWithoutContent = () => {
    const newDays = Math.max(stats.daysWithoutContent - 1, 0);
    recalculateStats(stats.postsThisWeek, stats.storiesThisWeek, newDays);
  };

  const recalculateStats = (posts: number, stories: number, daysOff: number) => {
    // Formula for activity score % based on target of 5 posts, 10 stories per week
    const postWeight = Math.min(posts / 5, 1) * 50;
    const storyWeight = Math.min(stories / 10, 1) * 40;
    const regularityWeight = (posts > 0 || stories > 0) ? Math.max((7 - daysOff) / 7, 0) * 10 : 0;
    
    const percentage = Math.round(postWeight + storyWeight + regularityWeight);
    saveStats({
      postsThisWeek: posts,
      storiesThisWeek: stories,
      daysWithoutContent: daysOff,
      activityPercentage: percentage
    });
  };

  const handleResetStats = () => {
    // Reset to empty initial state (0) instead of old pre-filled demo data
    saveStats({
      postsThisWeek: 0,
      storiesThisWeek: 0,
      daysWithoutContent: 0,
      activityPercentage: 0
    });
  };

  // Dynamic status warnings based on stats
  let adviceMessage = 'Отличная регулярность! Алгоритмы продвижения вас поддерживают.';
  let adviceType: 'success' | 'warning' | 'error' = 'success';

  if (stats.postsThisWeek === 0 && stats.storiesThisWeek === 0) {
    adviceMessage = 'Пока нет активности. Начните публиковать посты в плане или отмечайте дела в чек-листе!';
    adviceType = 'warning';
  } else if (stats.daysWithoutContent >= 3) {
    adviceMessage = '⚠️ Внимание: Вы пропустили публикации уже несколько дней подряд. Охваты могут резко упасть!';
    adviceType = 'error';
  } else if (stats.daysWithoutContent === 2) {
    adviceMessage = 'Вы пропустили публикацию в четверг. Выложите полезный пост прямо сегодня, чтобы вернуть охват!';
    adviceType = 'warning';
  } else if (stats.daysWithoutContent === 1) {
    adviceMessage = 'Вы пропустили вчерашнюю публикацию. Рекомендуется выложить хотя бы вовлекающую историю!';
    adviceType = 'warning';
  }

  return (
    <div id="reminders-stats-tab" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Screen 10: Daily Reminders (Left column) */}
      <div className="lg:col-span-6 space-y-4">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest font-mono">Мой распорядок</span>
              <h3 className="font-black text-slate-900 text-base font-sans tracking-tight">Что нужно сделать сегодня</h3>
            </div>
            <button
              type="button"
              onClick={handleResetReminders}
              className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-600 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Сбросить чек-лист
            </button>
          </div>

          <div className="space-y-2">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                onClick={() => handleToggleReminder(reminder.id)}
                className={`flex items-center justify-between p-4 rounded-[1.5rem] border transition-all cursor-pointer ${
                  reminder.completed 
                    ? 'bg-indigo-50/10 border-indigo-150 hover:bg-indigo-50/20' 
                    : 'bg-slate-50 border-slate-150 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="focus:outline-none flex-shrink-0 cursor-pointer">
                    {reminder.completed ? (
                      <CheckCircle className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-600 transition-colors" />
                    )}
                  </div>
                  <span className={`text-xs font-bold ${
                    reminder.completed ? 'text-slate-400 line-through' : 'text-slate-800'
                  }`}>
                    {reminder.text}
                  </span>
                </div>

                {reminder.completed && (
                  <span className="text-[9px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-full uppercase tracking-widest font-mono">Выполнено</span>
                )}
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 flex items-start gap-2.5 text-xs text-slate-500 font-medium">
            <Zap className="w-4.5 h-4.5 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">
              Отмечая выполнение пунктов <strong>«Опубликовать пост»</strong> или <strong>«Сделать сторис»</strong>, вы автоматически заносите результаты в статистику автопилота активности справа!
            </p>
          </div>
        </div>
      </div>

      {/* Screen 11: Activity Autopilot (Right column) */}
      <div className="lg:col-span-6 space-y-4">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest font-mono">Умный автопилот</span>
              <h3 className="font-black text-slate-900 text-base font-sans tracking-tight">Автопилот активности</h3>
            </div>
            <button
              type="button"
              onClick={handleResetStats}
              className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-600 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              title="Восстановить демо-активность"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Перезапуск
            </button>
          </div>

          {/* Interactive statistics parameters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-150 space-y-2 relative overflow-hidden">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Постов в неделю</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-sans font-black text-slate-900 tracking-tight">{stats.postsThisWeek}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => recalculateStats(Math.max(stats.postsThisWeek - 1, 0), stats.storiesThisWeek, stats.daysWithoutContent)}
                    className="p-1 hover:bg-white rounded border border-slate-200 cursor-pointer text-slate-400 hover:text-slate-700"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleAddPost}
                    className="p-1 hover:bg-white rounded border border-slate-200 cursor-pointer text-slate-400 hover:text-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-150 space-y-2 relative overflow-hidden">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Сторис в неделю</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-sans font-black text-slate-900 tracking-tight">{stats.storiesThisWeek}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => recalculateStats(stats.postsThisWeek, Math.max(stats.storiesThisWeek - 1, 0), stats.daysWithoutContent)}
                    className="p-1 hover:bg-white rounded border border-slate-200 cursor-pointer text-slate-400 hover:text-slate-700"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleAddStory}
                    className="p-1 hover:bg-white rounded border border-slate-200 cursor-pointer text-slate-400 hover:text-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-150 space-y-2 relative overflow-hidden">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Дней без контента</span>
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-sans font-black tracking-tight ${stats.daysWithoutContent > 1 ? 'text-rose-600' : 'text-slate-900'}`}>
                  {stats.daysWithoutContent}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleDecrementDaysWithoutContent}
                    className="p-1 hover:bg-white rounded border border-slate-200 cursor-pointer text-slate-400 hover:text-slate-700"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleIncrementDaysWithoutContent}
                    className="p-1 hover:bg-white rounded border border-slate-200 cursor-pointer text-slate-400 hover:text-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 text-white p-4 rounded-[1.5rem] border border-indigo-700 space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500 rounded-full blur-xl opacity-60 -mr-4 -mt-4"></div>
              <span className="text-[9px] font-black text-indigo-200 uppercase tracking-widest font-mono relative z-10">Активность SMM</span>
              <div className="flex items-center justify-between relative z-10">
                <span className="text-2xl font-sans font-black text-emerald-400 tracking-tight">{stats.activityPercentage}%</span>
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Autopilot hint and notifications banner */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed ${
            adviceType === 'error' 
              ? 'bg-rose-50 border-rose-100 text-rose-800' 
              : adviceType === 'warning'
                ? 'bg-amber-50 border-amber-100 text-amber-800'
                : 'bg-emerald-50 border-emerald-100 text-emerald-800'
          }`}>
            <AlertTriangle className={`w-4.5 h-4.5 mt-0.5 flex-shrink-0 ${
              adviceType === 'error' ? 'text-rose-500' : adviceType === 'warning' ? 'text-amber-500' : 'text-emerald-500'
            }`} />
            <p className="font-bold">
              {adviceMessage}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
