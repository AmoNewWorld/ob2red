import { ContentBlock, ExportConfig } from '../types';
import { PADDING } from '../constants';

export function createPageElement(
  blocks: ContentBlock[],
  config: ExportConfig,
  themeCSS: string
): HTMLDivElement {
  const page = document.createElement('div');
  page.className = 'ob2red-page';
  page.style.cssText = `
    width: ${config.pageWidth}px;
    height: ${config.pageHeight}px;
    overflow: hidden;
    position: relative;
    background: #ffffff;
  `;

  // Inject theme CSS via style tag
  const style = document.createElement('style');
  style.textContent = themeCSS;
  page.appendChild(style);

  // Content area
  const content = document.createElement('div');
  content.className = 'ob2red-page-content';
  content.style.cssText = `
    padding: ${PADDING.top}px ${PADDING.right}px ${PADDING.bottom}px ${PADDING.left}px;
    width: 100%;
    height: 100%;
    overflow: hidden;
  `;
  content.innerHTML = blocks.map(b => b.html).join('\n');

  // Force inline styles on <pre> and <pre><code> for html2canvas compatibility
  applyCodeBlockInlineStyles(content);

  page.appendChild(content);

  return page;
}

/**
 * html2canvas often fails to render text inside <pre><code> due to CSS specificity
 * or inheritance issues. Apply critical styles inline to guarantee rendering.
 */
function applyCodeBlockInlineStyles(container: HTMLElement): void {
  const preElements = container.querySelectorAll('pre');
  for (const pre of Array.from(preElements)) {
    const el = pre as HTMLElement;
    // Preserve existing inline styles, add critical overrides
    el.style.whiteSpace = 'pre-wrap';
    el.style.wordWrap = 'break-word';
    el.style.overflow = 'hidden';

    const codeEl = el.querySelector('code') as HTMLElement;
    if (codeEl) {
      codeEl.style.whiteSpace = 'pre-wrap';
      codeEl.style.wordWrap = 'break-word';
      codeEl.style.display = 'block';
      codeEl.style.fontFamily = '"SF Mono", "Fira Code", "Consolas", "Courier New", monospace';
      // If no explicit color set via theme CSS, ensure light text on dark bg
      if (!codeEl.style.color) {
        codeEl.style.color = '#cdd6f4';
      }
    }
  }
}
