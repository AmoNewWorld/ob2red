import { ExportConfig } from '../types';

export function createEndPageElement(config: ExportConfig, endCSS: string, themeCSS: string): HTMLDivElement {
  const page = document.createElement('div');
  page.className = 'ob2red-page';
  page.setCssProps({
    'width': `${config.pageWidth}px`,
    'height': `${config.pageHeight}px`,
    'overflow': 'hidden',
    'position': 'relative',
  });

  const style = document.createElement('style');
  style.textContent = themeCSS + '\n' + endCSS;
  page.appendChild(style);

  const end = document.createElement('div');
  end.className = 'ob2red-end';

  const thanks = end.createDiv({ cls: 'ob2red-end-thanks' });
  thanks.textContent = '感谢阅读';

  end.createDiv({ cls: 'ob2red-end-divider' });

  const cta = end.createDiv({ cls: 'ob2red-end-cta' });
  cta.textContent = '关注我获取更多干货内容';

  if (config.authorName) {
    const author = end.createDiv({ cls: 'ob2red-end-author' });
    author.textContent = `—— ${config.authorName} ——`;
  }

  page.appendChild(end);

  return page;
}
