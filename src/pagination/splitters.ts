import { marked } from 'marked';
import { ContentBlock } from '../types';
import { HeightMeasurer } from './height-measurer';

export function splitOversizedBlock(
  block: ContentBlock,
  maxHeight: number,
  measurer: HeightMeasurer,
  firstChunkMaxHeight?: number
): ContentBlock[] {
  const firstMax = firstChunkMaxHeight || maxHeight;
  if (block.type === 'table') return splitTable(block, maxHeight, measurer, firstMax);
  if (block.type === 'code') return splitCodeBlock(block, maxHeight, measurer, firstMax);
  if (block.type === 'list') return splitList(block, maxHeight, measurer, firstMax);
  if (block.type === 'blockquote') return splitBlockquote(block, maxHeight, measurer, firstMax);
  return splitParagraph(block, maxHeight, measurer, firstMax);
}

function splitParagraph(
  block: ContentBlock, maxHeight: number, measurer: HeightMeasurer, firstChunkMaxHeight: number
): ContentBlock[] {
  const text = block.raw.trim();
  const sentences = text.match(/[^。！？；\n]+[。！？；\n]?/g) || [text];
  if (sentences.length <= 1) return [block];

  const subBlocks: ContentBlock[] = [];
  let currentSentences: string[] = [];
  let isFirstChunk = true;

  for (let i = 0; i < sentences.length; i++) {
    currentSentences.push(sentences[i]);
    const testHtml = marked.parse(currentSentences.join('')) as string;
    const h = measurer.measure(testHtml);
    const limit = isFirstChunk ? firstChunkMaxHeight : maxHeight;

    if (h > limit && currentSentences.length > 1) {
      currentSentences.pop();
      const chunkMd = currentSentences.join('');
      const chunkHtml = marked.parse(chunkMd) as string;
      subBlocks.push({
        type: block.type, depth: block.depth, raw: chunkMd,
        html: chunkHtml, measuredHeight: measurer.measure(chunkHtml), keepWithNext: false,
      });
      currentSentences = [sentences[i]];
      isFirstChunk = false;
    }
  }

  if (currentSentences.length > 0) {
    const chunkMd = currentSentences.join('');
    const chunkHtml = marked.parse(chunkMd) as string;
    subBlocks.push({
      type: block.type, depth: block.depth, raw: chunkMd,
      html: chunkHtml, measuredHeight: measurer.measure(chunkHtml), keepWithNext: false,
    });
  }

  return subBlocks.length > 0 ? subBlocks : [block];
}

function splitTable(
  block: ContentBlock, maxHeight: number, measurer: HeightMeasurer, firstChunkMaxHeight: number
): ContentBlock[] {
  const raw = block.raw.trim();
  const lines = raw.split('\n').filter(l => l.trim());
  if (lines.length < 3) return [block];

  const headerLine = lines[0];
  const separatorLine = lines[1];
  const dataLines = lines.slice(2);
  if (dataLines.length === 0) return [block];

  const subBlocks: ContentBlock[] = [];
  let currentRows: string[] = [];
  let isFirst = true;

  for (let i = 0; i < dataLines.length; i++) {
    currentRows.push(dataLines[i]);
    const prefix = isFirst ? '' : '（续）\n\n';
    const testMd = `${prefix}${headerLine}\n${separatorLine}\n${currentRows.join('\n')}`;
    const testHtml = marked.parse(testMd) as string;
    const h = measurer.measure(testHtml);
    const limit = isFirst ? firstChunkMaxHeight : maxHeight;

    if (h > limit && currentRows.length > 1) {
      currentRows.pop();
      const chunkPrefix = isFirst ? '' : '（续）\n\n';
      const chunkMd = `${chunkPrefix}${headerLine}\n${separatorLine}\n${currentRows.join('\n')}`;
      const chunkHtml = marked.parse(chunkMd) as string;
      subBlocks.push({
        type: 'table', depth: 0, raw: chunkMd,
        html: chunkHtml, measuredHeight: measurer.measure(chunkHtml), keepWithNext: false,
      });
      currentRows = [dataLines[i]];
      isFirst = false;
    }
  }

  if (currentRows.length > 0) {
    const chunkPrefix = isFirst ? '' : '（续）\n\n';
    const chunkMd = `${chunkPrefix}${headerLine}\n${separatorLine}\n${currentRows.join('\n')}`;
    const chunkHtml = marked.parse(chunkMd) as string;
    subBlocks.push({
      type: 'table', depth: 0, raw: chunkMd,
      html: chunkHtml, measuredHeight: measurer.measure(chunkHtml), keepWithNext: false,
    });
  }

  return subBlocks.length > 0 ? subBlocks : [block];
}

function splitCodeBlock(
  block: ContentBlock, maxHeight: number, measurer: HeightMeasurer, firstChunkMaxHeight: number
): ContentBlock[] {
  const raw = block.raw.trim();
  const langMatch = raw.match(/^```(\w*)\n/);
  const lang = langMatch ? langMatch[1] : '';
  const codeBody = raw.replace(/^```\w*\n/, '').replace(/\n```$/, '');
  const codeLines = codeBody.split('\n');
  if (codeLines.length <= 1) return [block];

  const subBlocks: ContentBlock[] = [];
  let currentLines: string[] = [];
  let isFirstChunk = true;

  for (let i = 0; i < codeLines.length; i++) {
    currentLines.push(codeLines[i]);
    const testMd = '```' + lang + '\n' + currentLines.join('\n') + '\n```';
    const testHtml = marked.parse(testMd) as string;
    const h = measurer.measure(testHtml);
    const limit = isFirstChunk ? firstChunkMaxHeight : maxHeight;

    if (h > limit && currentLines.length > 1) {
      currentLines.pop();
      const chunkMd = '```' + lang + '\n' + currentLines.join('\n') + '\n```';
      const chunkHtml = marked.parse(chunkMd) as string;
      subBlocks.push({
        type: 'code', depth: 0, raw: chunkMd,
        html: chunkHtml, measuredHeight: measurer.measure(chunkHtml), keepWithNext: false,
      });
      currentLines = [codeLines[i]];
      isFirstChunk = false;
    }
  }

  if (currentLines.length > 0) {
    const chunkMd = '```' + lang + '\n' + currentLines.join('\n') + '\n```';
    const chunkHtml = marked.parse(chunkMd) as string;
    subBlocks.push({
      type: 'code', depth: 0, raw: chunkMd,
      html: chunkHtml, measuredHeight: measurer.measure(chunkHtml), keepWithNext: false,
    });
  }

  return subBlocks.length > 0 ? subBlocks : [block];
}

function splitList(
  block: ContentBlock, maxHeight: number, measurer: HeightMeasurer, firstChunkMaxHeight: number
): ContentBlock[] {
  const raw = block.raw.trim();
  const items: string[] = [];
  let currentItem = '';
  for (const line of raw.split('\n')) {
    if (/^\s*[-*+]\s|^\s*\d+\.\s/.test(line)) {
      if (currentItem) items.push(currentItem);
      currentItem = line;
    } else {
      currentItem += '\n' + line;
    }
  }
  if (currentItem) items.push(currentItem);
  if (items.length <= 1) return [block];

  const subBlocks: ContentBlock[] = [];
  let currentItems: string[] = [];
  let isFirstChunk = true;

  for (let i = 0; i < items.length; i++) {
    currentItems.push(items[i]);
    const testHtml = marked.parse(currentItems.join('\n')) as string;
    const h = measurer.measure(testHtml);
    const limit = isFirstChunk ? firstChunkMaxHeight : maxHeight;

    if (h > limit && currentItems.length > 1) {
      currentItems.pop();
      const chunkMd = currentItems.join('\n');
      const chunkHtml = marked.parse(chunkMd) as string;
      subBlocks.push({
        type: 'list', depth: 0, raw: chunkMd,
        html: chunkHtml, measuredHeight: measurer.measure(chunkHtml), keepWithNext: false,
      });
      currentItems = [items[i]];
      isFirstChunk = false;
    }
  }

  if (currentItems.length > 0) {
    const chunkMd = currentItems.join('\n');
    const chunkHtml = marked.parse(chunkMd) as string;
    subBlocks.push({
      type: 'list', depth: 0, raw: chunkMd,
      html: chunkHtml, measuredHeight: measurer.measure(chunkHtml), keepWithNext: false,
    });
  }

  return subBlocks.length > 0 ? subBlocks : [block];
}

function splitBlockquote(
  block: ContentBlock, maxHeight: number, measurer: HeightMeasurer, firstChunkMaxHeight: number
): ContentBlock[] {
  const raw = block.raw.trim();
  const innerLines = raw.split('\n').map(l => l.replace(/^>\s?/, ''));
  const innerText = innerLines.join('\n').trim();
  const sentences = innerText.match(/[^。！？；\n]+[。！？；\n]?/g) || [innerText];
  if (sentences.length <= 1) return [block];

  const subBlocks: ContentBlock[] = [];
  let currentSentences: string[] = [];
  let isFirstChunk = true;

  for (let i = 0; i < sentences.length; i++) {
    currentSentences.push(sentences[i]);
    const testMd = '> ' + currentSentences.join('').split('\n').join('\n> ');
    const testHtml = marked.parse(testMd) as string;
    const h = measurer.measure(testHtml);
    const limit = isFirstChunk ? firstChunkMaxHeight : maxHeight;

    if (h > limit && currentSentences.length > 1) {
      currentSentences.pop();
      const chunkMd = '> ' + currentSentences.join('').split('\n').join('\n> ');
      const chunkHtml = marked.parse(chunkMd) as string;
      subBlocks.push({
        type: 'blockquote', depth: 0, raw: chunkMd,
        html: chunkHtml, measuredHeight: measurer.measure(chunkHtml), keepWithNext: false,
      });
      currentSentences = [sentences[i]];
      isFirstChunk = false;
    }
  }

  if (currentSentences.length > 0) {
    const chunkMd = '> ' + currentSentences.join('').split('\n').join('\n> ');
    const chunkHtml = marked.parse(chunkMd) as string;
    subBlocks.push({
      type: 'blockquote', depth: 0, raw: chunkMd,
      html: chunkHtml, measuredHeight: measurer.measure(chunkHtml), keepWithNext: false,
    });
  }

  return subBlocks.length > 0 ? subBlocks : [block];
}
