export interface ContentBlock {
  type: string;
  depth: number;
  raw: string;
  html: string;
  measuredHeight: number;
  keepWithNext: boolean;
}

export interface PageSize {
  width: number;
  height: number;
}

export interface Padding {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface ExportConfig {
  title: string;
  date: string;
  theme: ThemeName;
  imageSize: ImageSizeName;
  authorName: string;
  showCover: boolean;
  showEndPage: boolean;
  coverSubtitle: string;
  pageWidth: number;
  pageHeight: number;
  padding: Padding;
  contentWidth: number;
  contentHeight: number;
}

export type ThemeName = 'minimal-white' | 'cream-warm' | 'dark-elegant' | 'highlight-pop';
export type ImageSizeName = '1080x1440' | '1080x1920';

export interface Ob2RedSettings {
  theme: ThemeName;
  imageSize: ImageSizeName;
  authorName: string;
  showCover: boolean;
  showEndPage: boolean;
  coverSubtitle: string;
}

export interface ThemeDefinition {
  name: string;
  label: string;
  css: string;
  coverCss: string;
  endPageCss: string;
}
