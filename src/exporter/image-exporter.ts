import html2canvas from 'html2canvas';

export async function captureElementAsBlob(
  element: HTMLElement,
  width: number,
  height: number,
  backgroundColor: string = '#ffffff'
): Promise<Blob> {
  // Append off-screen for rendering
  element.style.position = 'fixed';
  element.style.left = '-9999px';
  element.style.top = '0';
  document.body.appendChild(element);

  try {
    const canvas = await html2canvas(element, {
      width,
      height,
      scale: 2,
      useCORS: true,
      backgroundColor,
      logging: false,
    });

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create image blob'));
      }, 'image/png');
    });
  } finally {
    document.body.removeChild(element);
  }
}

export async function captureElementAsCanvas(
  element: HTMLElement,
  width: number,
  height: number,
  scale: number = 0.25,
  backgroundColor: string = '#ffffff'
): Promise<HTMLCanvasElement> {
  element.style.position = 'fixed';
  element.style.left = '-9999px';
  element.style.top = '0';
  document.body.appendChild(element);

  try {
    return await html2canvas(element, {
      width,
      height,
      scale,
      useCORS: true,
      backgroundColor,
      logging: false,
    });
  } finally {
    document.body.removeChild(element);
  }
}
