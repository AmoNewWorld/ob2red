import { MINIMAL_WHITE_CSS, MINIMAL_WHITE_COVER_CSS, MINIMAL_WHITE_END_CSS } from './minimal-white';

export const CREAM_WARM_CSS = MINIMAL_WHITE_CSS
  .replace(/background:\s*#ffffff/g, 'background: #FFF8F0')
  .replace(/color:\s*#1a1a1a/g, 'color: #3D3026')
  .replace(/color:\s*#111/g, 'color: #2C1810')
  .replace(/color:\s*#222/g, 'color: #3D3026')
  .replace(/color:\s*#333/g, 'color: #4A3728')
  .replace(/color:\s*#d63031/g, 'color: #C0392B')
  .replace(/background:\s*#2563eb/g, 'background: #D97706')
  .replace(/color:\s*#2563eb/g, 'color: #D97706')
  .replace(/border-left:\s*5px solid #2563eb/g, 'border-left: 5px solid #F59E0B')
  .replace(/background:\s*#f8f9fa/g, 'background: #FEF3C7')
  .replace(/border-bottom:\s*3px solid #f0f0f0/g, 'border-bottom: 3px solid #FDE68A')
  .replace(/background:\s*#eff6ff/g, 'background: #FFFBEB')
  .replace(/border-left:\s*5px solid #3b82f6/g, 'border-left: 5px solid #F59E0B')
  .replace(/background:\s*#f1f3f5/g, 'background: #FEF3C7');

export const CREAM_WARM_COVER_CSS = MINIMAL_WHITE_COVER_CSS
  .replace(/background:\s*#ffffff/g, 'background: #FFF8F0')
  .replace(/color:\s*#111/g, 'color: #2C1810')
  .replace(/background:\s*#2563eb/g, 'background: #D97706')
  .replace(/color:\s*#555/g, 'color: #6B4423')
  .replace(/color:\s*#888/g, 'color: #8B7355')
  .replace(/color:\s*#666/g, 'color: #7A5C3E');

export const CREAM_WARM_END_CSS = MINIMAL_WHITE_END_CSS
  .replace(/background:\s*#ffffff/g, 'background: #FFF8F0')
  .replace(/color:\s*#111/g, 'color: #2C1810')
  .replace(/background:\s*#2563eb/g, 'background: #D97706')
  .replace(/color:\s*#555/g, 'color: #6B4423')
  .replace(/color:\s*#666/g, 'color: #7A5C3E');
