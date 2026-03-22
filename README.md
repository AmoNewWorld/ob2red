# Ob2Red

Export Obsidian notes to **Xiaohongshu (小红书)** style images with smart pagination — one click, beautifully formatted.

![Obsidian](https://img.shields.io/badge/Obsidian-%23483699.svg?style=flat&logo=obsidian&logoColor=white)
![License](https://img.shields.io/github/license/AmoNewWorld/ob2red)

## Features

- **Smart Pagination** — Automatically splits long notes into multiple pages with proper content breaks
- **Live Preview** — Real-time preview in the right sidebar, updates as you type
- **4 Built-in Themes** — 极简白底 / 奶油暖色 / 深色高端 / 荧光标记
- **Two Image Sizes** — 1080×1440 (3:4) and 1080×1920 (9:16)
- **Cover & End Pages** — Auto-generated cover with title and customizable end page
- **Export Single or All** — Export the current page or all pages at once
- **Obsidian Callout Support** — Renders Obsidian callouts (`> [!note]`, `> [!tip]`, etc.) with themed styling
- **Frontmatter Overrides** — Per-note theme/size/author customization via YAML frontmatter

## Usage

1. Open a Markdown note in Obsidian
2. Click the **camera icon** in the left ribbon, or use the command palette: `Ob2Red: 导出为小红书图片`
3. The preview panel opens in the right sidebar
4. Select theme and size, browse pages via thumbnails
5. Click **导出当前页** or **导出全部** to save as PNG images

## Frontmatter Overrides

Override plugin settings on a per-note basis:

```yaml
---
ob2red:
  theme: cream-warm          # minimal-white | cream-warm | dark-elegant | highlight-pop
  size: 1080x1920            # 1080x1440 | 1080x1920
  author: Your Name
  cover-subtitle: A subtitle
  show-cover: true
  show-end-page: false
---
```

## Themes

| Theme | Description |
|-------|-------------|
| `minimal-white` | Clean white background with minimal styling |
| `cream-warm` | Warm cream tones for a cozy reading feel |
| `dark-elegant` | Dark background with elegant typography |
| `highlight-pop` | Bright highlights and bold accents |

## Installation

### From Obsidian Community Plugins

1. Open Obsidian Settings → Community Plugins → Browse
2. Search for **Ob2Red**
3. Click Install, then Enable

### Manual Installation

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/AmoNewWorld/ob2red/releases)
2. Create a folder `ob2red` in your vault's `.obsidian/plugins/` directory
3. Copy the downloaded files into that folder
4. Restart Obsidian and enable the plugin in Settings → Community Plugins

## License

[MIT](LICENSE)
