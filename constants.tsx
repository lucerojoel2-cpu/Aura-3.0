
import React from 'react';

export const MODELS = {
  FLASH: 'gemini-3-flash-preview',
  PRO: 'gemini-3-pro-preview',
  LIVE: 'gemini-2.5-flash-native-audio-preview-12-2025',
  IMAGE: 'gemini-2.5-flash-image'
};

export const UI_COLORS = {
  primary: 'violet-500',
  secondary: 'indigo-500',
  accent: 'fuchsia-500',
  bg: 'slate-950',
};

export const NAV_ITEMS = [
  { id: 'chat', icon: <i className="fa-solid fa-message"></i>, label: 'Chat' },
  { id: 'live', icon: <i className="fa-solid fa-microphone-lines"></i>, label: 'Live' },
  { id: 'vision', icon: <i className="fa-solid fa-eye"></i>, label: 'Vision' },
  { id: 'settings', icon: <i className="fa-solid fa-gear"></i>, label: 'Settings' },
];
