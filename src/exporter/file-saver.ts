export async function pickExportDirectory(): Promise<string | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { remote } = require('electron');
    const result = await remote.dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory'],
      title: '选择图片保存位置',
      buttonLabel: '保存到此处',
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    return result.filePaths[0];
  } catch {
    // Fallback: try @electron/remote
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const remote = require('@electron/remote');
      const result = await remote.dialog.showOpenDialog({
        properties: ['openDirectory', 'createDirectory'],
        title: '选择图片保存位置',
        buttonLabel: '保存到此处',
      });
      if (result.canceled || result.filePaths.length === 0) return null;
      return result.filePaths[0];
    } catch {
      return null;
    }
  }
}

export async function saveBlob(blob: Blob, filePath: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  const buffer = Buffer.from(await blob.arrayBuffer());
  fs.writeFileSync(filePath, buffer);
}
