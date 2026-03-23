import { App, PluginSettingTab, Setting } from 'obsidian';
import type Ob2RedPlugin from '../main';
import { ThemeName, ImageSizeName } from '../types';
import { getAllThemes } from '../themes/theme-manager';

export class Ob2RedSettingTab extends PluginSettingTab {
  plugin: Ob2RedPlugin;

  constructor(app: App, plugin: Ob2RedPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl).setName('Ob2Red settings').setHeading();

    // Theme
    const themes = getAllThemes();
    new Setting(containerEl)
      .setName('主题')
      .setDesc('选择导出图片的视觉主题')
      .addDropdown(dd => {
        for (const theme of themes) {
          dd.addOption(theme.name, theme.label);
        }
        dd.setValue(this.plugin.settings.theme);
        dd.onChange(async (value) => {
          this.plugin.settings.theme = value as ThemeName;
          await this.plugin.saveSettings();
        });
      });

    // Image size
    new Setting(containerEl)
      .setName('图片尺寸')
      .setDesc('导出图片的尺寸')
      .addDropdown(dd => {
        dd.addOption('1080x1440', '1080 × 1440 (3:4 竖版标准)');
        dd.addOption('1080x1920', '1080 × 1920 (9:16 手机全屏)');
        dd.setValue(this.plugin.settings.imageSize);
        dd.onChange(async (value) => {
          this.plugin.settings.imageSize = value as ImageSizeName;
          await this.plugin.saveSettings();
        });
      });

    // Author name
    new Setting(containerEl)
      .setName('作者名')
      .setDesc('显示在封面页和尾页上的作者名')
      .addText(text => text
        .setPlaceholder('你的名字或小红书 ID')
        .setValue(this.plugin.settings.authorName)
        .onChange(async (value) => {
          this.plugin.settings.authorName = value;
          await this.plugin.saveSettings();
        }));

    // Cover subtitle
    new Setting(containerEl)
      .setName('封面副标题')
      .setDesc('封面页标题下方的副标题文字（可选）')
      .addText(text => text
        .setPlaceholder('可选副标题')
        .setValue(this.plugin.settings.coverSubtitle)
        .onChange(async (value) => {
          this.plugin.settings.coverSubtitle = value;
          await this.plugin.saveSettings();
        }));

    // Show cover
    new Setting(containerEl)
      .setName('显示封面页')
      .setDesc('在第一张图片前添加封面页')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.showCover)
        .onChange(async (value) => {
          this.plugin.settings.showCover = value;
          await this.plugin.saveSettings();
        }));

    // Show end page
    new Setting(containerEl)
      .setName('显示尾页')
      .setDesc('在最后添加"感谢阅读"尾页')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.showEndPage)
        .onChange(async (value) => {
          this.plugin.settings.showEndPage = value;
          await this.plugin.saveSettings();
        }));
  }
}
