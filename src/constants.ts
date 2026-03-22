import { Ob2RedSettings, ImageSizeName, Padding } from './types';

export const VIEW_TYPE_OB2RED = 'ob2red-preview';

export const PAGE_SIZES: Record<ImageSizeName, { width: number; height: number }> = {
  '1080x1440': { width: 1080, height: 1440 },
  '1080x1920': { width: 1080, height: 1920 },
};

export const PADDING: Padding = { top: 60, bottom: 60, left: 72, right: 72 };

export const MIN_PAGE_CONTENT = 80;

export const DEFAULT_SETTINGS: Ob2RedSettings = {
  theme: 'minimal-white',
  imageSize: '1080x1440',
  authorName: '',
  showCover: true,
  showEndPage: true,
  coverSubtitle: '',
};

export function getContentDimensions(sizeName: ImageSizeName) {
  const size = PAGE_SIZES[sizeName];
  return {
    pageWidth: size.width,
    pageHeight: size.height,
    contentWidth: size.width - PADDING.left - PADDING.right,
    contentHeight: size.height - PADDING.top - PADDING.bottom,
  };
}
