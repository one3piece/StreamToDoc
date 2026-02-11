export interface TimelineItem {
  timestamp: string;
  title: string;
  description: string;
}

export interface MindMapNode {
  name: string;
  children?: MindMapNode[];
}

export interface SummaryResult {
  title: string;
  overview: string;
  structuredSummary: string; // Markdown format
  keyPoints: string[];
  timeline: TimelineItem[];
  mindMap: MindMapNode;
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

export interface VideoMetadata {
  url: string;
  title: string;
  thumbnail: string;
  duration: string;
}