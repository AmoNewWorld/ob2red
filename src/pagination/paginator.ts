import { ContentBlock } from '../types';
import { HeightMeasurer } from './height-measurer';
import { splitOversizedBlock } from './splitters';
import { MIN_PAGE_CONTENT } from '../constants';

export function paginate(
  blocks: ContentBlock[],
  pageHeight: number,
  measurer: HeightMeasurer
): ContentBlock[][] {
  const pages: ContentBlock[][] = [];
  let currentPage: ContentBlock[] = [];
  let currentHeight = 0;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const bh = block.measuredHeight;

    // Case 1: Fits in current page
    if (currentHeight + bh <= pageHeight) {
      currentPage.push(block);
      currentHeight += bh;
      continue;
    }

    // Case 2: Doesn't fit, need new page
    if (currentPage.length > 0) {
      const lastBlock = currentPage[currentPage.length - 1];
      if (lastBlock.keepWithNext && currentPage.length > 1) {
        currentPage.pop();
        currentHeight -= lastBlock.measuredHeight;
        pages.push(currentPage);
        currentPage = [lastBlock];
        currentHeight = lastBlock.measuredHeight;
      } else {
        pages.push(currentPage);
        currentPage = [];
        currentHeight = 0;
      }
    }

    // Case 3: Block larger than remaining space → split
    if (bh > pageHeight - currentHeight) {
      const remainingHeight = pageHeight - currentHeight;
      const subBlocks = splitOversizedBlock(block, pageHeight, measurer, remainingHeight);
      for (const sub of subBlocks) {
        if (currentHeight + sub.measuredHeight > pageHeight && currentPage.length > 0) {
          pages.push(currentPage);
          currentPage = [];
          currentHeight = 0;
        }
        currentPage.push(sub);
        currentHeight += sub.measuredHeight;
      }
      continue;
    }

    currentPage.push(block);
    currentHeight += bh;
  }

  // Flush last page
  if (currentPage.length > 0) {
    if (currentHeight < MIN_PAGE_CONTENT && pages.length > 0) {
      const prev = pages[pages.length - 1];
      prev.push(...currentPage);
    } else {
      pages.push(currentPage);
    }
  }

  // Post-process: fix orphaned headings at end of pages
  // If a page ends with a heading (keepWithNext), move it to next page
  for (let p = 0; p < pages.length - 1; p++) {
    const page = pages[p];
    if (page.length > 1) {
      const lastBlock = page[page.length - 1];
      if (lastBlock.keepWithNext) {
        page.pop();
        pages[p + 1].unshift(lastBlock);
      }
    }
  }

  return pages;
}
