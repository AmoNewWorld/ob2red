import { ContentBlock, ExportConfig } from '../types';
import { PADDING } from '../constants';

export function createPageElement(
  blocks: ContentBlock[],
  config: ExportConfig,
  themeCSS: string
): HTMLDivElement {
  const page = document.createElement('div');
  page.className = 'ob2red-page';
  page.setCssProps({
    'width': `${config.pageWidth}px`,
    'height': `${config.pageHeight}px`,
    'overflow': 'hidden',
    'position': 'relative',
    'background': '#ffffff',
  });

  // Theme CSS must be injected per-page because html2canvas renders a DOM snapshot
  // and cannot access Obsidian's global stylesheet
  const style = document.createElement('style');
  style.textContent = themeCSS;
  page.appendChild(style);

  const content = document.createElement('div');
  content.className = 'ob2red-page-content';
  content.setCssProps({
    'padding': `${PADDING.top}px ${PADDING.right}px ${PADDING.bottom}px ${PADDING.left}px`,
    'width': '100%',
    'height': '100%',
    'overflow': 'hidden',
  });

  // innerHTML is required here because we render pre-built HTML from the markdown parser
  // into an off-screen DOM node for html2canvas to capture as an image
  for (const b of blocks) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = b.html;
    while (wrapper.firstChild) {
      content.appendChild(wrapper.firstChild);
    }
  }

  page.appendChild(content);

  return page;
}
