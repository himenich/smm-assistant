/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Check, 
  Copy, 
  MessageCircle, 
  Layers, 
  Instagram, 
  BookOpen, 
  ThumbsUp, 
  CheckSquare, 
  Info,
  ChevronRight
} from 'lucide-react';

interface AdapterTabProps {
  selectedPlatforms: string[];
}

export default function AdapterTab({ selectedPlatforms }: AdapterTabProps) {
  const [text, setText] = useState('');
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const paragraphCount = text.trim() ? text.split('\n\n').filter(Boolean).length : 0;

  const handleCopyText = (platformId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPlatform(platformId);
    setTimeout(() => setCopiedPlatform(null), 2000);
  };

  // Logic evaluations for VK
  const isVkTooLong = charCount > 2000;
  const hasVkQuestion = text.includes('?') || text.includes('как') || text.includes('почему');
  
  // Logic evaluations for TG
  const isTgEmpty = charCount === 0;
  const isTgGoodLength = charCount > 400 && charCount < 3000;
  const hasTgStorytelling = text.includes('я') || text.includes('мой') || text.includes('история') || text.includes('опыт');

  // Logic evaluations for Instagram
  const hasInstaShortParagraphs = paragraphCount >= Math.ceil(charCount / 400); // good density
  const hasInstaEngagement = text.includes('коммент') || text.includes('лайк') || text.includes('подпис') || text.includes('сохран') || text.includes('директ');

  // Logic evaluations for Zen
  const isZenExpertStyle = charCount > 800;
  const hasZenHeading = text.split('\n')[0]?.length > 15; // first line is a title candidate

  return (
    <div id="adapter-tab" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Interactive Editor (Left side) */}
      <div className="lg:col-span-6 space-y-4">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest font-mono">Умный Адаптер</span>
              <h3 className="font-black text-slate-900 text-lg tracking-tight">Редактор текста поста</h3>
            </div>
            <div className="text-right font-mono text-[10px] text-slate-400 font-bold">
              <div>{charCount} / 4000 СИМВ.</div>
              <div>{wordCount} СЛОВ</div>
            </div>
          </div>

          <textarea
            className="w-full h-80 p-4 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans text-slate-700 leading-relaxed resize-y"
            placeholder="Вставьте или начните писать ваш пост сюда, чтобы увидеть рекомендации по адаптации в реальном времени под разные соцсети..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 flex items-start gap-2.5 text-xs text-slate-500 font-medium">
            <Info className="w-4.5 h-4.5 text-indigo-500 mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">
              Напишите универсальный скелет поста, а наши чек-листы ниже помогут вам подогнать его под стандарты выбранных социальных сетей для получения максимальных охватов.
            </p>
          </div>
        </div>
      </div>

      {/* Platform adaptivity checklists (Right side) */}
      <div className="lg:col-span-6 space-y-4">
        <h3 className="font-black text-slate-900 text-base font-sans px-1 tracking-tight">
          Рекомендации и правила площадок
        </h3>

        <div className="space-y-6 max-h-[540px] overflow-y-auto pr-1 custom-scrollbar">
          
          {/* 1. Telegram card */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4 border-l-4 border-l-sky-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-slate-850 text-xs uppercase tracking-wider">Telegram</h4>
              </div>
              <button
                type="button"
                disabled={!text}
                onClick={() => handleCopyText('telegram')}
                className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  copiedPlatform === 'telegram'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : text 
                      ? 'bg-white border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200'
                      : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                {copiedPlatform === 'telegram' ? 'Скопировано!' : 'Копировать'}
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              В Telegram ценится глубокий, экспертный или личный контент (лонгриды). Аудитория готова читать вдумчиво.
            </p>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2.5 text-xs">
                <CheckSquare className={`w-4 h-4 flex-shrink-0 ${isTgGoodLength ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span className={`font-semibold ${isTgGoodLength ? 'text-slate-800' : 'text-slate-400 font-medium'}`}>
                  Длина текста достаточна для лонгрида (&gt;400 симв.)
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <CheckSquare className={`w-4 h-4 flex-shrink-0 ${hasTgStorytelling ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span className={`font-semibold ${hasTgStorytelling ? 'text-slate-800' : 'text-slate-400 font-medium'}`}>
                  Добавлены элементы сторителлинга или личного опыта (я, мой, опыт)
                </span>
              </div>
            </div>
          </div>

          {/* 2. VKontakte card */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-slate-850 text-xs uppercase tracking-wider">ВКонтакте</h4>
              </div>
              <button
                type="button"
                disabled={!text}
                onClick={() => handleCopyText('vk')}
                className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  copiedPlatform === 'vk'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : text 
                      ? 'bg-white border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200'
                      : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                {copiedPlatform === 'vk' ? 'Скопировано!' : 'Копировать'}
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              ВКонтакте важна вовлеченность с первых строк и интерактивность. Слишком длинные посты срезают охваты.
            </p>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2.5 text-xs">
                <CheckSquare className={`w-4 h-4 flex-shrink-0 ${!isVkTooLong && charCount > 0 ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span className={`font-semibold ${!isVkTooLong && charCount > 0 ? 'text-slate-800' : 'text-slate-400 font-medium'}`}>
                  {isVkTooLong ? '⚠️ Превышен лимит 2000 символов (сократите для ВК)' : 'Объем укладывается в 2000 символов'}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <CheckSquare className={`w-4 h-4 flex-shrink-0 ${hasVkQuestion ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span className={`font-semibold ${hasVkQuestion ? 'text-slate-800' : 'text-slate-400 font-medium'}`}>
                  Присутствует интерактивный вопрос или обращение к аудитории
                </span>
              </div>
            </div>
          </div>

          {/* 3. Instagram card */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4 border-l-4 border-l-pink-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-pink-50 text-pink-600 border border-pink-100">
                  <Instagram className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-slate-850 text-xs uppercase tracking-wider">Instagram</h4>
              </div>
              <button
                type="button"
                disabled={!text}
                onClick={() => handleCopyText('instagram')}
                className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  copiedPlatform === 'instagram'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : text 
                      ? 'bg-white border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200'
                      : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                {copiedPlatform === 'instagram' ? 'Скопировано!' : 'Копировать'}
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              В Instagram текст является дополнением к картинке или карусели. Пишите короткими, "воздушными" абзацами.
            </p>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2.5 text-xs">
                <CheckSquare className={`w-4 h-4 flex-shrink-0 ${hasInstaShortParagraphs && charCount > 0 ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span className={`font-semibold ${hasInstaShortParagraphs && charCount > 0 ? 'text-slate-800' : 'text-slate-400 font-medium'}`}>
                  Короткие воздушные абзацы (пустые строки разделения)
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <CheckSquare className={`w-4 h-4 flex-shrink-0 ${hasInstaEngagement ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span className={`font-semibold ${hasInstaEngagement ? 'text-slate-800' : 'text-slate-400 font-medium'}`}>
                  Призыв к вовлечению (напишите комментарий, сохраните, пишите в директ)
                </span>
              </div>
            </div>
          </div>

          {/* 4. Dzen card */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4 border-l-4 border-l-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-neutral-100 text-neutral-800 border border-neutral-200">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-slate-850 text-xs uppercase tracking-wider">Яндекс Дзен</h4>
              </div>
              <button
                type="button"
                disabled={!text}
                onClick={() => handleCopyText('zen')}
                className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  copiedPlatform === 'zen'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : text 
                      ? 'bg-white border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200'
                      : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                {copiedPlatform === 'zen' ? 'Скопировано!' : 'Копировать'}
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              В Дзен ценится глубокая авторская экспертиза и яркие, цепляющие забавные или интригующие заголовки статей.
            </p>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2.5 text-xs">
                <CheckSquare className={`w-4 h-4 flex-shrink-0 ${hasZenHeading ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span className={`font-semibold ${hasZenHeading ? 'text-slate-800' : 'text-slate-400 font-medium'}`}>
                  Первая строчка выделена как заголовок статьи
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <CheckSquare className={`w-4 h-4 flex-shrink-0 ${isZenExpertStyle ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span className={`font-semibold ${isZenExpertStyle ? 'text-slate-800' : 'text-slate-400 font-medium'}`}>
                  Статья достаточно развернутая и информативная (&gt;800 симв.)
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
