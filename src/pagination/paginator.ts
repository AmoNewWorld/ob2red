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

  /** Measure the real rendered height of the current page's blocks combined */
  function currentPageHeight(): number {
    if (currentPage.length === 0) return 0;
    return measurer.measureCombined(currentPage.map(b => b.html));
  }

  /** Check if adding a block would overflow the page */
  function wouldOverflow(block: ContentBlock): boolean {
    const testBlocks = [...currentPage, block];
    return measurer.measureCombined(testBlocks.map(b => b.html)) > pageHeight;
  }

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    // Case 1: Fits in current page
    if (!wouldOverflow(block)) {
      currentPage.push(block);
      continue;
    }

    // Case 2: Doesn't fit, flush current page
    if (currentPage.length > 0) {
      const lastBlock = currentPage[currentPage.length - 1];
      if (lastBlock.keepWithNext && currentPage.length > 1) {
        // Move orphaned heading to next page
        currentPage.pop();
        pages.push(currentPage);
        currentPage = [lastBlock];
      } else {
        pages.push(currentPage);
        currentPage = [];
      }
    }

    // Case 3: Block alone exceeds a full page → split it
    if (block.measuredHeight > pageHeight) {
      const remainingHeight = pageHeight - currentPageHeight();
      const subBlocks = splitOversizedBlock(block, pageHeight, measurer, remainingHeight);
      for (const sub of subBlocks) {
        if (currentPage.length > 0 && wouldOverflowWith(currentPage, sub, measurer, pageHeight)) {
          pages.push(currentPage);
          currentPage = [];
        }
        currentPage.push(sub);
      }
      continue;
    }

    // Case 4: Block fits on a new page (after flush)
    currentPage.push(block);
  }

  // Flush last page
  if (currentPage.length > 0) {
    const h = currentPageHeight();
    if (h < MIN_PAGE_CONTENT && pages.length > 0) {
      const prev = pages[pages.length - 1];
      prev.push(...currentPage);
    } else {
      pages.push(currentPage);
    }
  }

  // Post-process: fix orphaned headings at end of pages
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

function wouldOverflowWith(
  currentPage: ContentBlock[],
  block: ContentBlock,
  measurer: HeightMeasurer,
  pageHeight: number
): boolean {
  const testBlocks = [...currentPage, block];
  return measurer.measureCombined(testBlocks.map(b => b.html)) > pageHeight;
}
