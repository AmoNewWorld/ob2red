import { Plugin, Menu, TFile, addIcon, WorkspaceLeaf } from 'obsidian';
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
      name: 'Export to Xiaohongshu images',
      callback: () => {
        void this.activateView();
      },
    });

    // Ribbon icon
    this.addRibbonIcon('ob2red-camera', 'Ob2Red: Preview Xiaohongshu images', () => {
      void this.activateView();
    });

    // Right-click menu on file
    this.registerEvent(
      this.app.workspace.on('file-menu', (menu: Menu, file: TFile) => {
        if (file.extension === 'md') {
          menu.addItem((item) => {
            item.setTitle('预览小红书图片')
              .setIcon('ob2red-camera')
              .onClick(async () => {
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
            .onClick(() => void this.activateView());
        });
      })
    );

    // Settings tab
    this.addSettingTab(new Ob2RedSettingTab(this.app, this));
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async activateView() {
    const { workspace } = this.app;

    const leaves = workspace.getLeavesOfType(VIEW_TYPE_OB2RED);
    if (leaves.length > 0) {
      void workspace.revealLeaf(leaves[0]);
      return;
    }

    const leaf = workspace.getRightLeaf(false);
    if (leaf) {
      await leaf.setViewState({
        type: VIEW_TYPE_OB2RED,
        active: true,
      });
      void workspace.revealLeaf(leaf);
    }
  }
}
