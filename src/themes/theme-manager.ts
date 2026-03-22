import { ThemeName, ThemeDefinition } from '../types';
import { MINIMAL_WHITE_CSS, MINIMAL_WHITE_COVER_CSS, MINIMAL_WHITE_END_CSS } from './minimal-white';
import { CREAM_WARM_CSS, CREAM_WARM_COVER_CSS, CREAM_WARM_END_CSS } from './cream-warm';
import { DARK_ELEGANT_CSS, DARK_ELEGANT_COVER_CSS, DARK_ELEGANT_END_CSS } from './dark-elegant';
import { HIGHLIGHT_POP_CSS, HIGHLIGHT_POP_COVER_CSS, HIGHLIGHT_POP_END_CSS } from './highlight-pop';

const THEMES: Record<ThemeName, ThemeDefinition> = {
  'minimal-white': {
    name: 'minimal-white',
    label: '极简白底',
    css: MINIMAL_WHITE_CSS,
    coverCss: MINIMAL_WHITE_COVER_CSS,
    endPageCss: MINIMAL_WHITE_END_CSS,
  },
  'cream-warm': {
    name: 'cream-warm',
    label: '奶油暖色',
    css: CREAM_WARM_CSS,
    coverCss: CREAM_WARM_COVER_CSS,
    endPageCss: CREAM_WARM_END_CSS,
  },
  'dark-elegant': {
    name: 'dark-elegant',
    label: '深色高端',
    css: DARK_ELEGANT_CSS,
    coverCss: DARK_ELEGANT_COVER_CSS,
    endPageCss: DARK_ELEGANT_END_CSS,
  },
  'highlight-pop': {
    name: 'highlight-pop',
    label: '荧光标记',
    css: HIGHLIGHT_POP_CSS,
    coverCss: HIGHLIGHT_POP_COVER_CSS,
    endPageCss: HIGHLIGHT_POP_END_CSS,
  },
};

export function getTheme(name: ThemeName): ThemeDefinition {
  return THEMES[name] || THEMES['minimal-white'];
}

export function getAllThemes(): ThemeDefinition[] {
  return Object.values(THEMES);
}
