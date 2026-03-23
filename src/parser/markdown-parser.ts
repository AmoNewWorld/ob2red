import { marked } from 'marked';
import { ContentBlock } from '../types';

// Obsidian callout type → display label & color class
const CALLOUT_LABELS: Record<string, string> = {
  note: '笔记',
  info: '信息',
  tip: '提示',
  hint: '提示',
  important: '重要',
  warning: '警告',
  caution: '注意',
  danger: '危险',
  bug: 'Bug',
  example: '示例',
  quote: '引用',
  cite: '引用',
  abstract: '摘要',
  summary: '摘要',
  tldr: 'TL;DR',
  todo: 'TODO',
  success: '成功',
  check: '成功',
  done: '成功',
  question: '问题',
  help: '问题',
  faq: 'FAQ',
  failure: '失败',
  fail: '失败',
  missing: '缺失',
};

/**
 * Convert Obsidian callout blockquote to styled HTML.
 * Input raw format: > [!type] Optional title\n> content...
 */
function convertCallout(raw: string): { html: string; calloutType: string } | null {
  const lines = raw.split('\n');
  const firstLine = lines[0].replace(/^>\s?/, '');
  const calloutMatch = firstLine.match(/^\[!(\w+)\]\s*(.*)?$/);
  if (!calloutMatch) return null;

  const calloutType = calloutMatch[1].toLowerCase();
  const customTitle = calloutMatch[2]?.trim();
  const title = customTitle || CALLOUT_LABELS[calloutType] || calloutType.charAt(0).toUpperCase() + calloutType.slice(1);

  // Extract body lines (skip first line which is the callout declaration)
  const bodyLines = lines.slice(1).map(l => l.replace(/^>\s?/, ''));
  const bodyMd = bodyLines.join('\n').trim();
  const bodyHtml = bodyMd ? marked.parse(bodyMd) as string : '';

  const colorClass = getCalloutColorClass(calloutType);

  const html = `<div class="callout callout-${colorClass}">
<div class="callout-title">${escapeHtml(title)}</div>
${bodyHtml ? `<div class="callout-content">${bodyHtml}</div>` : ''}
</div>`;

  return { html, calloutType };
}

function getCalloutColorClass(type: string): string {
  const blueTypes = ['info', 'note'];
  const yellowTypes = ['warning', 'caution', 'attention'];
  const greenTypes = ['tip', 'hint', 'success', 'check', 'done'];
  const redTypes = ['danger', 'important', 'bug', 'failure', 'fail', 'missing'];
  const purpleTypes = ['example', 'abstract', 'summary', 'tldr'];
  const grayTypes = ['quote', 'cite', 'question', 'help', 'faq', 'todo'];

  if (blueTypes.includes(type)) return 'blue';
  if (yellowTypes.includes(type)) return 'yellow';
  if (greenTypes.includes(type)) return 'green';
  if (redTypes.includes(type)) return 'red';
  if (purpleTypes.includes(type)) return 'purple';
  if (grayTypes.includes(type)) return 'gray';
  return 'blue';
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Preprocess Obsidian-specific markdown syntax before passing to marked.
 * - Converts wikilinks [[page|text]] and [[page]] to standard markdown links
 */
function preprocessObsidianSyntax(md: string): string {
  // [[page|display text]] → [display text](#)
  // [[page]] → [page](#)
  return md.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '[$2](#)')
           .replace(/\[\[([^\]]+)\]\]/g, '[$1](#)');
}

export function parseMarkdownToBlocks(md: string): ContentBlock[] {
  const preprocessed = preprocessObsidianSyntax(md);
  const tokens = marked.lexer(preprocessed);
  const blocks: ContentBlock[] = [];

  for (const token of tokens) {
    if (token.type === 'space') continue;

    let html: string;
    let blockType = token.type;

    // Check if blockquote is an Obsidian callout
    if (token.type === 'blockquote') {
      const calloutResult = convertCallout(token.raw);
      if (calloutResult) {
        html = calloutResult.html;
        blockType = 'callout';
      } else {
        html = marked.parser([token] as Parameters<typeof marked.parser>[0]);
      }
    } else {
      html = marked.parser([token] as Parameters<typeof marked.parser>[0]);
    }

    blocks.push({
      type: blockType,
      depth: ('depth' in token ? token.depth : 0) as number,
      raw: token.raw,
      html,
      measuredHeight: 0,
      keepWithNext: token.type === 'heading',
    });
  }

  return blocks;
}

export function extractTitle(md: string): string {
  const match = md.match(/^#\s+(.+)$/m);
  if (match) return match[1].trim();
  const match2 = md.match(/^#{1,6}\s+(.+)$/m);
  if (match2) return match2[1].trim();
  return 'Untitled';
}
