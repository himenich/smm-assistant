/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NicheCategory {
  id: string;
  name: string;
  subNiches: string[];
}

export type Platform = 'vk' | 'telegram' | 'instagram' | 'ok' | 'zen';

export interface PlatformInfo {
  id: Platform;
  name: string;
  icon: string;
  color: string;
}

export interface Rubric {
  id: string;
  title: string;
  description: string;
  exampleTopic: string;
}

export interface PostStructure {
  type: string;
  title: string;
  steps: {
    title: string;
    description: string;
    example: string;
  }[];
}

export interface HashtagGroup {
  author: string[];
  thematic: string[];
  navigation: string[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ReminderItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ContentPlanDay {
  dayNumber: number;
  dayOfWeek: string;
  rubric: string;
  topic: string;
  postType: string;
  published: boolean;
  notes?: string;
}

export interface ActivityStats {
  postsThisWeek: number;
  storiesThisWeek: number;
  daysWithoutContent: number;
  activityPercentage: number;
}

export interface TemplateItem {
  id: string;
  title: string;
  text: string;
  category: 'sales' | 'engaging' | 'stories' | 'headings' | 'calls';
}
