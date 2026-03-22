import { ItemView, WorkspaceLeaf, MarkdownView, Notice, debounce } from 'obsidian';
import { ExportConfig, ThemeName, ImageSizeName, Ob2RedSettings } from '../types';
import { getContentDimensions, PADDING, VIEW_TYPE_OB2RED } from '../constants';
import { parseMarkdownToBlocks, extractTitle } from '../parser/markdown-parser';
import { HeightMeasurer } from '../pagination/height-measurer';
import { paginate } from '../pagination/paginator';
import { getTheme, getAllThemes } from '../themes/theme-manager';
import { createPageElement } from '../renderer/page-renderer';
import { createCoverElement } from '../renderer/cover-page';
import { createEndPageElement } from '../renderer/end-page';
import { captureElementAsBlob, captureElementAsCanvas } from '../exporter/image-exporter';
import { pickExportDirectory, saveBlob } from '../exporter/file-saver';
import { parseFrontmatterOverrides } from '../utils/frontmatter';
import type Ob2RedPlugin from '../main';

export class PreviewView extends ItemView {
  private plugin: Ob2RedPlugin;
  private currentTheme: ThemeName;
  private currentSize: ImageSizeName;
  private pageElements: HTMLDivElement[] = [];
  private selectedIndex = 0;

  // DOM refs
  private controlsEl!: HTMLElement;
  private thumbnailContainer!: HTMLElement;
  private previewContainer!: HTMLElement;
  private footerEl!: HTMLElement;
  private statusEl!: HTMLElement;
  private themeSelect!: HTMLSelectElement;
  private sizeSelect!: HTMLSelectElement;

  // Debounced functions
  private debouncedEditorRefresh: () => void;
  private debouncedThumbnailRefresh: () => void;

  // Refresh state
  private refreshing = false;
  private refreshVersion = 0; // incremented on each refresh to cancel stale renders

  // Thumbnail cache: key = page outerHTML hash, value = canvas
  private thumbCache = new Map<string, HTMLCanvasElement>();

  constructor(leaf: WorkspaceLeaf, plugin: Ob2RedPlugin) {
    super(leaf);
    this.plugin = plugin;
    this.currentTheme = plugin.settings.theme;
    this.currentSize = plugin.settings.imageSize;
    // Editor changes: update preview quickly, thumbnails lazily
    this.debouncedEditorRefresh = debounce(() => this.refreshPreviewOnly(), 800, true);
    this.debouncedThumbnailRefresh = debounce(() => this.renderThumbnails(), 2000, true);
  }

  getViewType(): string {
    return VIEW_TYPE_OB2RED;
  }

  getDisplayText(): string {
    return 'Ob2Red 预览';
  }

  getIcon(): string {
    return 'ob2red-camera';
  }

  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('ob2red-view');

    // Header action button
    this.addAction('refresh-cw', '刷新预览', () => {
      this.refreshFromActiveFile();
    });

    // Controls
    this.controlsEl = contentEl.createDiv({ cls: 'ob2red-controls' });

    const themeGroup = this.controlsEl.createDiv({ cls: 'ob2red-control-group' });
    themeGroup.createSpan({ text: '主题', cls: 'ob2red-label' });
    this.themeSelect = themeGroup.createEl('select', { cls: 'ob2red-select' });
    for (const t of getAllThemes()) {
      const opt = this.themeSelect.createEl('option', { text: t.label, value: t.name });
      if (t.name === this.currentTheme) opt.selected = true;
    }
    this.themeSelect.addEventListener('change', () => {
      this.currentTheme = this.themeSelect.value as ThemeName;
      this.thumbCache.clear();
      this.refreshFromActiveFile();
    });

    const sizeGroup = this.controlsEl.createDiv({ cls: 'ob2red-control-group' });
    sizeGroup.createSpan({ text: '尺寸', cls: 'ob2red-label' });
    this.sizeSelect = sizeGroup.createEl('select', { cls: 'ob2red-select' });
    this.sizeSelect.createEl('option', { text: '1080×1440 (3:4)', value: '1080x1440' });
    this.sizeSelect.createEl('option', { text: '1080×1920 (9:16)', value: '1080x1920' });
    this.sizeSelect.value = this.currentSize;
    this.sizeSelect.addEventListener('change', () => {
      this.currentSize = this.sizeSelect.value as ImageSizeName;
      this.thumbCache.clear();
      this.refreshFromActiveFile();
    });

    // Thumbnails
    this.thumbnailContainer = contentEl.createDiv({ cls: 'ob2red-thumbnails' });

    // Preview
    this.previewContainer = contentEl.createDiv({ cls: 'ob2red-preview' });

    // Footer
    this.footerEl = contentEl.createDiv({ cls: 'ob2red-footer' });
    const exportOneBtn = this.footerEl.createEl('button', { text: '导出当前页', cls: 'ob2red-export-btn ob2red-export-one' });
    exportOneBtn.addEventListener('click', () => this.exportCurrent());
    const exportAllBtn = this.footerEl.createEl('button', { text: '导出全部', cls: 'ob2red-export-btn' });
    exportAllBtn.addEventListener('click', () => this.exportAll());

    // Empty state
    this.statusEl = contentEl.createDiv({ cls: 'ob2red-empty' });
    this.statusEl.setText('打开一个 Markdown 笔记以预览小红书图片');

    // Register workspace events
    this.registerEvent(
      this.app.workspace.on('active-leaf-change', (leaf) => {
        if (leaf?.view instanceof PreviewView) return;
        this.thumbCache.clear();
        this.refreshFromActiveFile();
      })
    );

    this.registerEvent(
      this.app.workspace.on('editor-change', () => {
        // On typing: only refresh the main preview quickly
        // Thumbnails update lazily after 2s idle
        this.debouncedEditorRefresh();
        this.debouncedThumbnailRefresh();
      })
    );

    // Initial render
    this.refreshFromActiveFile();
  }

  async onClose() {
    this.contentEl.empty();
    this.pageElements = [];
    this.thumbCache.clear();
  }

  private showEmptyState(show: boolean) {
    this.statusEl.style.display = show ? 'flex' : 'none';
    this.controlsEl.style.display = show ? 'none' : '';
    this.thumbnailContainer.style.display = show ? 'none' : '';
    this.previewContainer.style.display = show ? 'none' : '';
    this.footerEl.style.display = show ? 'none' : '';
  }

  /**
   * Fast path: only re-run pipeline + update the main preview canvas.
   * Skips thumbnail rendering for speed during typing.
   */
  private async refreshPreviewOnly() {
    const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!mdView || !mdView.file) {
      this.showEmptyState(true);
      this.pageElements = [];
      return;
    }

    this.showEmptyState(false);

    try {
      const content = mdView.editor.getValue();
      const config = this.buildConfig(mdView);
      const pages = this.runPipeline(content, config);
      this.pageElements = pages;
      this.selectedIndex = Math.min(this.selectedIndex, Math.max(0, pages.length - 1));
      await this.renderPreview(this.selectedIndex);
    } catch (err) {
      console.error('Ob2Red preview error:', err);
    }
  }

  /**
   * Full refresh: pipeline + preview + thumbnails.
   * Used for initial load, file switch, theme/size change.
   */
  private async refreshFromActiveFile() {
    if (this.refreshing) return;
    this.refreshing = true;
    const version = ++this.refreshVersion;

    try {
      const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (!mdView || !mdView.file) {
        this.showEmptyState(true);
        this.pageElements = [];
        return;
      }

      this.showEmptyState(false);

      const content = mdView.editor.getValue();
      const config = this.buildConfig(mdView);
      const pages = this.runPipeline(content, config);
      this.pageElements = pages;
      this.selectedIndex = Math.min(this.selectedIndex, Math.max(0, pages.length - 1));

      // Bail if a newer refresh was triggered
      if (version !== this.refreshVersion) return;

      // Render preview first (fast, user sees result immediately)
      await this.renderPreview(this.selectedIndex);

      if (version !== this.refreshVersion) return;

      // Then render thumbnails (slower)
      await this.renderThumbnails();
    } catch (err) {
      console.error('Ob2Red preview error:', err);
    } finally {
      this.refreshing = false;
    }
  }

  private buildConfig(mdView: MarkdownView): ExportConfig {
    const cache = mdView.file ? this.app.metadataCache.getFileCache(mdView.file) : null;
    const overrides = parseFrontmatterOverrides(cache?.frontmatter);
    const mergedSettings: Ob2RedSettings = { ...this.plugin.settings, ...overrides };
    mergedSettings.theme = this.currentTheme;
    mergedSettings.imageSize = this.currentSize;

    const dims = getContentDimensions(mergedSettings.imageSize);
    return {
      ...mergedSettings,
      ...dims,
      padding: PADDING,
      title: '',
      date: new Date().toISOString().split('T')[0],
    };
  }

  private runPipeline(markdown: string, config: ExportConfig): HTMLDivElement[] {
    const theme = getTheme(this.currentTheme);

    const cleanMd = markdown.replace(/^---[\s\S]*?---\n*/, '');
    const title = extractTitle(cleanMd);
    config.title = title;
    const contentMd = cleanMd.replace(/^#\s+.+\n*/m, '');
    const blocks = parseMarkdownToBlocks(contentMd);

    const measurer = new HeightMeasurer(config.contentWidth, theme.css);
    try {
      for (const block of blocks) {
        block.measuredHeight = measurer.measure(block.html);
      }

      const pages = paginate(blocks, config.contentHeight, measurer);
      const elements: HTMLDivElement[] = [];

      if (config.showCover) {
        elements.push(createCoverElement(config, theme.coverCss, theme.css));
      }

      for (const pageBlocks of pages) {
        elements.push(createPageElement(pageBlocks, config, theme.css));
      }

      if (config.showEndPage) {
        elements.push(createEndPageElement(config, theme.endPageCss, theme.css));
      }

      return elements;
    } finally {
      measurer.destroy();
    }
  }

  /** Simple hash for cache key */
  private hashElement(el: HTMLDivElement): string {
    // Use outerHTML length + first/last chars as a fast fingerprint
    const html = el.outerHTML;
    const len = html.length;
    // Sample chars at fixed positions for a quick hash
    const sample = `${len}:${html.charCodeAt(0)}:${html.charCodeAt(len >> 2)}:${html.charCodeAt(len >> 1)}:${html.charCodeAt((len * 3) >> 2)}:${html.charCodeAt(len - 1)}`;
    return sample;
  }

  private async renderThumbnails() {
    if (!this.thumbnailContainer) return;
    this.thumbnailContainer.empty();

    const bgColor = this.currentTheme === 'dark-elegant' ? '#1A1A2E' : '#ffffff';
    const config = this.getCurrentConfig();
    const version = this.refreshVersion;

    for (let i = 0; i < this.pageElements.length; i++) {
      // Bail if stale
      if (version !== this.refreshVersion) return;

      const pageEl = this.pageElements[i];
      const cacheKey = this.hashElement(pageEl);

      let canvas: HTMLCanvasElement;
      const cached = this.thumbCache.get(cacheKey);
      if (cached) {
        // Clone cached canvas
        canvas = document.createElement('canvas');
        canvas.width = cached.width;
        canvas.height = cached.height;
        canvas.getContext('2d')!.drawImage(cached, 0, 0);
      } else {
        const el = pageEl.cloneNode(true) as HTMLDivElement;
        canvas = await captureElementAsCanvas(
          el,
          config.pageWidth,
          config.pageHeight,
          0.12,
          bgColor
        );
        // Store in cache
        this.thumbCache.set(cacheKey, canvas);
      }

      // Bail if stale (after async gap)
      if (version !== this.refreshVersion) return;

      const thumb = this.thumbnailContainer.createDiv({
        cls: `ob2red-thumb ${i === this.selectedIndex ? 'ob2red-thumb-active' : ''}`,
      });

      const canvasClone = document.createElement('canvas');
      canvasClone.width = canvas.width;
      canvasClone.height = canvas.height;
      canvasClone.getContext('2d')!.drawImage(canvas, 0, 0);
      thumb.appendChild(canvasClone);

      const label = thumb.createDiv({ cls: 'ob2red-thumb-label' });
      if (config.showCover && i === 0) {
        label.setText('封面');
      } else if (config.showEndPage && i === this.pageElements.length - 1) {
        label.setText('尾页');
      } else {
        const pageNum = config.showCover ? i : i + 1;
        label.setText(`${pageNum}`);
      }

      const idx = i;
      thumb.addEventListener('click', () => {
        this.selectedIndex = idx;
        this.thumbnailContainer?.querySelectorAll('.ob2red-thumb').forEach(t => t.removeClass('ob2red-thumb-active'));
        thumb.addClass('ob2red-thumb-active');
        this.renderPreview(idx);
      });
    }
  }

  private async renderPreview(index: number) {
    if (!this.previewContainer || index >= this.pageElements.length) return;
    this.previewContainer.empty();

    const config = this.getCurrentConfig();
    const el = this.pageElements[index].cloneNode(true) as HTMLDivElement;
    const bgColor = this.currentTheme === 'dark-elegant' ? '#1A1A2E' : '#ffffff';
    const canvas = await captureElementAsCanvas(
      el,
      config.pageWidth,
      config.pageHeight,
      0.4,
      bgColor
    );
    canvas.addClass('ob2red-preview-canvas');
    this.previewContainer.appendChild(canvas);
  }

  private getCurrentConfig(): ExportConfig {
    const dims = getContentDimensions(this.currentSize);
    return {
      ...this.plugin.settings,
      ...dims,
      theme: this.currentTheme,
      imageSize: this.currentSize,
      padding: PADDING,
      title: '',
      date: new Date().toISOString().split('T')[0],
    };
  }

  private async exportCurrent() {
    if (this.pageElements.length === 0 || this.selectedIndex >= this.pageElements.length) {
      new Notice('没有可导出的页面');
      return;
    }

    const dir = await pickExportDirectory();
    if (!dir) {
      new Notice('未选择保存位置');
      return;
    }

    const path = require('path');
    const config = this.getCurrentConfig();
    const i = this.selectedIndex;

    const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);
    let title = 'Untitled';
    if (mdView) {
      const content = mdView.editor.getValue();
      const cleanMd = content.replace(/^---[\s\S]*?---\n*/, '');
      title = extractTitle(cleanMd);
    }
    const baseName = title.replace(/[\\/:*?"<>|]/g, '_');
    const bgColor = this.currentTheme === 'dark-elegant' ? '#1A1A2E' : '#ffffff';

    const el = this.pageElements[i].cloneNode(true) as HTMLDivElement;
    const blob = await captureElementAsBlob(
      el,
      config.pageWidth,
      config.pageHeight,
      bgColor
    );

    let filename: string;
    if (config.showCover && i === 0) {
      filename = `${baseName}_00_cover.png`;
    } else if (config.showEndPage && i === this.pageElements.length - 1) {
      filename = `${baseName}_${String(i).padStart(2, '0')}_end.png`;
    } else {
      filename = `${baseName}_${String(i).padStart(2, '0')}.png`;
    }

    await saveBlob(blob, path.join(dir, filename));
    new Notice(`已导出: ${filename}`);
  }

  private async exportAll() {
    if (this.pageElements.length === 0) {
      new Notice('没有可导出的页面');
      return;
    }

    const dir = await pickExportDirectory();
    if (!dir) {
      new Notice('未选择保存位置');
      return;
    }

    const path = require('path');
    const config = this.getCurrentConfig();

    const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);
    let title = 'Untitled';
    if (mdView) {
      const content = mdView.editor.getValue();
      const cleanMd = content.replace(/^---[\s\S]*?---\n*/, '');
      title = extractTitle(cleanMd);
    }
    const baseName = title.replace(/[\\/:*?"<>|]/g, '_');
    const bgColor = this.currentTheme === 'dark-elegant' ? '#1A1A2E' : '#ffffff';

    new Notice(`正在导出 ${this.pageElements.length} 张图片...`);

    for (let i = 0; i < this.pageElements.length; i++) {
      const el = this.pageElements[i].cloneNode(true) as HTMLDivElement;
      const blob = await captureElementAsBlob(
        el,
        config.pageWidth,
        config.pageHeight,
        bgColor
      );

      let filename: string;
      if (config.showCover && i === 0) {
        filename = `${baseName}_00_cover.png`;
      } else if (config.showEndPage && i === this.pageElements.length - 1) {
        filename = `${baseName}_${String(i).padStart(2, '0')}_end.png`;
      } else {
        filename = `${baseName}_${String(i).padStart(2, '0')}.png`;
      }

      await saveBlob(blob, path.join(dir, filename));
    }

    new Notice(`已导出 ${this.pageElements.length} 张图片到 ${dir}`);
  }
}
