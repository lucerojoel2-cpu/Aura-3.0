
export type ViewMode = 'chat' | 'live' | 'vision' | 'settings';

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  type?: 'text' | 'image' | 'audio';
  imageUrl?: string;
  groundingLinks?: GroundingChunk[];
}

// Fixed GroundingChunk to align with @google/genai SDK types where uri and title are optional
export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  maps?: {
    uri?: string;
    title?: string;
  };
}

export enum VoiceName {
  Puck = 'Puck',
  Charon = 'Charon',
  Kore = 'Kore',
  Fenrir = 'Fenrir',
  Zephyr = 'Zephyr'
}
