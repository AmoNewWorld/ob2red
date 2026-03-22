export class HeightMeasurer {
  private container: HTMLDivElement;
  private wrapper: HTMLDivElement;

  constructor(contentWidth: number, themeCSS: string) {
    this.container = document.createElement('div');
    this.container.style.cssText = `position:fixed;visibility:hidden;left:-9999px;top:0;width:${contentWidth}px;`;
    this.container.className = 'ob2red-measure-root';

    const style = document.createElement('style');
    style.textContent = themeCSS;
    this.container.appendChild(style);

    this.wrapper = document.createElement('div');
    this.wrapper.className = 'ob2red-page-content';
    this.container.appendChild(this.wrapper);

    document.body.appendChild(this.container);
  }

  measure(html: string): number {
    this.wrapper.innerHTML = html;
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
