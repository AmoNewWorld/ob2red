import { Ob2RedSettings } from '../types';

export interface FrontmatterOverrides {
  theme?: string;
  author?: string;
  'cover-title'?: string;
  'cover-subtitle'?: string;
  size?: string;
  'show-cover'?: boolean;
  'show-end-page'?: boolean;
}

export function parseFrontmatterOverrides(
  frontmatter: Record<string, unknown> | undefined
): Partial<Ob2RedSettings> {
  if (!frontmatter || !frontmatter['ob2red']) return {};

  const ob2red = frontmatter['ob2red'] as FrontmatterOverrides;
  const overrides: Partial<Ob2RedSettings> = {};

  if (ob2red.theme) {
    const valid = ['minimal-white', 'cream-warm', 'dark-elegant', 'highlight-pop'];
    if (valid.includes(ob2red.theme)) {
      overrides.theme = ob2red.theme as Ob2RedSettings['theme'];
    }
  }
  if (ob2red.author) overrides.authorName = ob2red.author;
  if (ob2red['cover-subtitle']) overrides.coverSubtitle = ob2red['cover-subtitle'];
  if (ob2red.size) {
    const valid = ['1080x1440', '1080x1920'];
    if (valid.includes(ob2red.size)) {
      overrides.imageSize = ob2red.size as Ob2RedSettings['imageSize'];
    }
  }
  if (typeof ob2red['show-cover'] === 'boolean') overrides.showCover = ob2red['show-cover'];
  if (typeof ob2red['show-end-page'] === 'boolean') overrides.showEndPage = ob2red['show-end-page'];

  return overrides;
}
