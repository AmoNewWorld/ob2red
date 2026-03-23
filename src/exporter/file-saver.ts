export async function pickExportDirectory(): Promise<string | null> {
  try {
    // electron is externalized by esbuild and must be loaded at runtime
    const electron = require('electron'); // eslint-disable-line -- electron is external
    const result = await electron.remote.dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory'],
      title: '选择图片保存位置',
      buttonLabel: '保存到此处',
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    return result.filePaths[0];
  } catch {
    try {
      const remote = require('@electron/remote'); // eslint-disable-line -- electron is external
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

export function joinPath(...parts: string[]): string {
  const path = require('path'); // eslint-disable-line -- node:path is external
  return path.join(...parts);
}

export async function saveBlob(blob: Blob, filePath: string): Promise<void> {
  const fs = require('fs'); // eslint-disable-line -- node:fs is external
  const buffer = Buffer.from(await blob.arrayBuffer());
  fs.writeFileSync(filePath, buffer);
}
