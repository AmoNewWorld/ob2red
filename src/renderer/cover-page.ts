import { ExportConfig } from '../types';

export function createCoverElement(config: ExportConfig, coverCSS: string, themeCSS: string): HTMLDivElement {
  const page = document.createElement('div');
  page.className = 'ob2red-page';
  page.setCssProps({
    'width': `${config.pageWidth}px`,
    'height': `${config.pageHeight}px`,
    'overflow': 'hidden',
    'position': 'relative',
  });

  const style = document.createElement('style');
  style.textContent = themeCSS + '\n' + coverCSS;
  page.appendChild(style);

  const cover = document.createElement('div');
  cover.className = 'ob2red-cover';

  const title = cover.createDiv({ cls: 'ob2red-cover-title' });
  title.textContent = config.title;

  cover.createDiv({ cls: 'ob2red-cover-divider' });

  if (config.coverSubtitle) {
    const subtitle = cover.createDiv({ cls: 'ob2red-cover-subtitle' });
    subtitle.textContent = config.coverSubtitle;
  }

  if (config.authorName) {
    const author = cover.createDiv({ cls: 'ob2red-cover-author' });
    author.textContent = config.authorName;
  }

  const meta = cover.createDiv({ cls: 'ob2red-cover-meta' });
  meta.textContent = config.date;

  page.appendChild(cover);

  return page;
}
