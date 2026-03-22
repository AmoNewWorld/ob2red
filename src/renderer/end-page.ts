import { ExportConfig } from '../types';
import { escapeHTML } from '../utils/escape-html';

export function createEndPageElement(config: ExportConfig, endCSS: string, themeCSS: string): HTMLDivElement {
  const page = document.createElement('div');
  page.className = 'ob2red-page';
  page.style.cssText = `
    width: ${config.pageWidth}px;
    height: ${config.pageHeight}px;
    overflow: hidden;
    position: relative;
  `;

  const style = document.createElement('style');
  style.textContent = themeCSS + '\n' + endCSS;
  page.appendChild(style);

  const end = document.createElement('div');
  end.className = 'ob2red-end';
  end.innerHTML = `
    <div class="ob2red-end-thanks">感谢阅读</div>
    <div class="ob2red-end-divider"></div>
    <div class="ob2red-end-cta">关注我获取更多干货内容</div>
    ${config.authorName ? `<div class="ob2red-end-author">—— ${escapeHTML(config.authorName)} ——</div>` : ''}
  `;
  page.appendChild(end);

  return page;
}
