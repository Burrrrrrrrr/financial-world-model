import type { ComponentType } from 'react';

export type LessonReference = {
  id: number;
  authors: string;
  year: string;
  accessedAt?: string;
  title: string;
  publication: string;
  url: string;
  use: string;
};

export type LessonReview = {
  kind: 'accuracy' | 'pedagogy';
  completedAt: string;
  decision: 'approved' | 'changes-requested';
  revision: string;
  summary: string;
};

export type LessonReading = {
  title: string;
  scope: string;
  reason: string;
  url: string;
  group?: 'core' | 'models' | 'evidence' | 'systems' | 'rules';
  guide?: string;
  links?: { label: string; url: string }[];
};

export type LessonRecord = {
  slug: string;
  id: string;
  chapter: string;
  chapterTitle: string;
  title: string;
  subtitle: string;
  readingTime: string;
  prerequisite: string;
  updatedAt: string;
  revision: string;
  reviewStatus: 'draft' | 'double-reviewed';
  reviews: LessonReview[];
  previous?: { slug: string; label: string };
  next?: { slug?: string; label: string };
  sectionNumberStart?: number;
  sections: { id: string; label: string }[];
  Content: ComponentType;
  references: LessonReference[];
  readingList: LessonReading[];
  readingListOrder?: 'grouped' | 'source';
};
