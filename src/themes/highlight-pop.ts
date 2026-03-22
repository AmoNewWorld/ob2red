import { MINIMAL_WHITE_CSS, MINIMAL_WHITE_COVER_CSS, MINIMAL_WHITE_END_CSS } from './minimal-white';

export const HIGHLIGHT_POP_CSS = MINIMAL_WHITE_CSS
  .replace(/color:\s*#d63031/g, 'color: #FF6B6B')
  .replace(/color:\s*#2563eb/g, 'color: #FF6B6B')
  .replace(/background:\s*#2563eb/g, 'background: #FF6B6B')
  .replace(/border-left:\s*5px solid #2563eb/g, 'border-left: 5px solid #FF6B6B')
  .replace(/border-left:\s*5px solid #3b82f6/g, 'border-left: 5px solid #FF6B6B')
  .replace(/background:\s*#eff6ff/g, 'background: #FFF5F5')
  .replace(/border-bottom:\s*1px dashed #2563eb/g, 'border-bottom: 1px dashed #FF6B6B')
  .replace(/color:\s*#d63384/g, 'color: #E91E63');

export const HIGHLIGHT_POP_COVER_CSS = MINIMAL_WHITE_COVER_CSS
  .replace(/background:\s*#2563eb/g, 'background: #FF6B6B');

export const HIGHLIGHT_POP_END_CSS = MINIMAL_WHITE_END_CSS
  .replace(/background:\s*#2563eb/g, 'background: #FF6B6B');
