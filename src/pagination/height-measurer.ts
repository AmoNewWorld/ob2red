export class HeightMeasurer {
  private container: HTMLDivElement;
  private wrapper: HTMLDivElement;

  constructor(contentWidth: number, themeCSS: string) {
    this.container = document.createElement('div');
    this.container.className = 'ob2red-measure-root ob2red-offscreen';
    this.container.setCssProps({ 'width': `${contentWidth}px` });

    // Theme CSS must be injected for accurate height measurement
    // as elements like headings, lists, callouts have theme-specific margins
    const style = document.createElement('style');
    style.textContent = themeCSS;
    this.container.appendChild(style);

    this.wrapper = document.createElement('div');
    this.wrapper.className = 'ob2red-page-content';
    this.container.appendChild(this.wrapper);

    document.body.appendChild(this.container);
  }

  measure(html: string): number {
    // innerHTML is required to render pre-built HTML from markdown parser
    // for accurate height measurement via getBoundingClientRect
    this.wrapper.innerHTML = html;
    const h = Math.ceil(this.wrapper.getBoundingClientRect().height);
    this.wrapper.innerHTML = '';
    return h;
  }

  measureCombined(htmlBlocks: string[]): number {
    this.wrapper.innerHTML = htmlBlocks.join('\n');
    const h = Math.ceil(this.wrapper.getBoundingClientRect().height);
    this.wrapper.innerHTML = '';
    return h;
  }

  destroy(): void {
    if (this.container.parentNode) {
      document.body.removeChild(this.container);
    }
  }
}
