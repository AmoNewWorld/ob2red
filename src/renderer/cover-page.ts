import { ExportConfig } from '../types';
import { escapeHTML } from '../utils/escape-html';

export function createCoverElement(config: ExportConfig, coverCSS: string, themeCSS: string): HTMLDivElement {
  const page = document.createElement('div');
  page.className = 'ob2red-page';
  page.style.cssText = `
    width: ${config.pageWidth}px;
    height: ${config.pageHeight}px;
    overflow: hidden;
    position: relative;
  `;

  const style = document.createElement('style');
  style.textContent = themeCSS + '\n' + coverCSS;
  page.appendChild(style);

  const cover = document.createElement('div');
  cover.className = 'ob2red-cover';
  cover.innerHTML = `
    <div class="ob2red-cover-title">${escapeHTML(config.title)}</div>
    <div class="ob2red-cover-divider"></div>
    ${config.coverSubtitle ? `<div class="ob2red-cover-subtitle">${escapeHTML(config.coverSubtitle)}</div>` : ''}
    ${config.authorName ? `<div class="ob2red-cover-author">${escapeHTML(config.authorName)}</div>` : ''}
    <div class="ob2red-cover-meta">${config.date}</div>
  `;
  page.appendChild(cover);

  return page;
}
