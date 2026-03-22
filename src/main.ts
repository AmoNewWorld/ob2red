import { Plugin, MarkdownView, Notice, Menu, TFile, addIcon, WorkspaceLeaf } from 'obsidian';
import { Ob2RedSettings } from './types';
import { DEFAULT_SETTINGS, VIEW_TYPE_OB2RED } from './constants';
import { Ob2RedSettingTab } from './ui/settings-tab';
import { PreviewView } from './ui/preview-view';
import { OB2RED_ICON_SVG } from './icon';

export default class Ob2RedPlugin extends Plugin {
  settings: Ob2RedSettings = DEFAULT_SETTINGS;

  async onload() {
    await this.loadSettings();

    // Register custom icon
    addIcon('ob2red-camera', OB2RED_ICON_SVG);

    // Register the sidebar view
    this.registerView(
      VIEW_TYPE_OB2RED,
      (leaf: WorkspaceLeaf) => new PreviewView(leaf, this)
    );

    // Command palette
    this.addCommand({
      id: 'export-to-xiaohongshu',
      name: '导出为小红书图片',
      callback: () => {
        this.activateView();
      },
    });

    // Ribbon icon
    this.addRibbonIcon('ob2red-camera', 'Ob2Red: 预览小红书图片', () => {
      this.activateView();
    });

    // Right-click menu on file
    this.registerEvent(
      this.app.workspace.on('file-menu', (menu: Menu, file: TFile) => {
        if (file.extension === 'md') {
          menu.addItem((item) => {
            item.setTitle('预览小红书图片')
              .setIcon('ob2red-camera')
              .onClick(async () => {
                // Open the file first, then activate view
                await this.app.workspace.openLinkText(file.path, '', false);
                await this.activateView();
              });
          });
        }
      })
    );

    // Editor right-click menu
    this.registerEvent(
      this.app.workspace.on('editor-menu', (menu: Menu) => {
        menu.addItem((item) => {
          item.setTitle('预览小红书图片')
            .setIcon('ob2red-camera')
            .onClick(() => this.activateView());
        });
      })
    );

    // Settings tab
    this.addSettingTab(new Ob2RedSettingTab(this.app, this));
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_OB2RED);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async activateView() {
    const { workspace } = this.app;

    // Check if view already exists
    let leaves = workspace.getLeavesOfType(VIEW_TYPE_OB2RED);
    if (leaves.length > 0) {
      workspace.revealLeaf(leaves[0]);
      return;
    }

    // Open in right sidebar
    const leaf = workspace.getRightLeaf(false);
    if (leaf) {
      await leaf.setViewState({
        type: VIEW_TYPE_OB2RED,
        active: true,
      });
      workspace.revealLeaf(leaf);
    }
  }
}
