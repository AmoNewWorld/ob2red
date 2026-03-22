const BASE_CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
`;

export const DARK_ELEGANT_CSS = `${BASE_CSS}
body, .ob2red-page-content, .ob2red-measure-root {
  font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", "Hiragino Sans GB", sans-serif;
  font-size: 28px;
  line-height: 1.85;
  color: #E0E0E0;
  background: #1A1A2E;
  -webkit-font-smoothing: antialiased;
}
h1 { font-size: 46px; font-weight: 900; line-height: 1.4; margin-bottom: 20px; color: #FFFFFF; letter-spacing: -0.5px; }
h2 { font-size: 38px; font-weight: 700; line-height: 1.45; margin-top: 28px; margin-bottom: 16px; color: #FFFFFF; padding-bottom: 10px; border-bottom: 3px solid #2A2A4A; }
h3 { font-size: 33px; font-weight: 700; line-height: 1.5; margin-top: 22px; margin-bottom: 12px; color: #F0F0F0; }
h4, h5, h6 { font-size: 30px; font-weight: 600; line-height: 1.5; margin-top: 18px; margin-bottom: 10px; color: #D0D0D0; }
p { margin-bottom: 18px; text-align: justify; }
strong { font-weight: 700; color: #FF6B9D; }
em { font-style: italic; color: #A0A0C0; }
blockquote { margin: 18px 0; padding: 16px 20px; background: #16213E; border-left: 5px solid #7C3AED; border-radius: 0 8px 8px 0; color: #C0C0D0; font-size: 26px; line-height: 1.8; }
blockquote p { margin-bottom: 8px; }
blockquote p:last-child { margin-bottom: 0; }
ul, ol { margin: 14px 0; padding-left: 36px; }
li { margin-bottom: 10px; line-height: 1.75; }
li::marker { color: #7C3AED; font-weight: 700; }
code { font-family: "SF Mono", "Fira Code", "Consolas", monospace; font-size: 24px; background: #2A2A4A; padding: 3px 8px; border-radius: 4px; color: #BB86FC; }
pre { margin: 18px 0; padding: 20px; background: #0D1117; border-radius: 10px; overflow: hidden; line-height: 1.6; border: 1px solid #2A2A4A; white-space: pre-wrap; word-wrap: break-word; }
pre code { background: none; color: #cdd6f4; padding: 0; font-size: 22px; white-space: pre-wrap; word-wrap: break-word; }
table { width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 25px; }
th { background: #7C3AED; color: #fff; font-weight: 600; padding: 12px 16px; text-align: left; }
td { padding: 11px 16px; border-bottom: 1px solid #2A2A4A; }
tr:nth-child(even) td { background: #16213E; }
hr { border: none; height: 2px; background: #2A2A4A; margin: 24px 0; }
img { max-width: 100%; border-radius: 8px; margin: 14px 0; }
a { color: #BB86FC; text-decoration: none; border-bottom: 1px dashed #BB86FC; }
.callout { margin: 18px 0; padding: 16px 20px; border-radius: 10px; background: #16213E; border-left: 5px solid #7C3AED; font-size: 26px; line-height: 1.8; color: #C0C0D0; }
.callout-title { font-weight: 700; font-size: 27px; margin-bottom: 8px; }
.callout-content p { margin-bottom: 8px; }
.callout-content p:last-child { margin-bottom: 0; }
.callout-blue { background: #0f1d3a; border-left-color: #60a5fa; }
.callout-blue .callout-title { color: #93bbfc; }
.callout-yellow { background: #2a2312; border-left-color: #fbbf24; }
.callout-yellow .callout-title { color: #fcd34d; }
.callout-green { background: #0f291a; border-left-color: #4ade80; }
.callout-green .callout-title { color: #86efac; }
.callout-red { background: #2d1216; border-left-color: #f87171; }
.callout-red .callout-title { color: #fca5a5; }
.callout-purple { background: #1e1333; border-left-color: #c084fc; }
.callout-purple .callout-title { color: #d8b4fe; }
.callout-gray { background: #1f2937; border-left-color: #9ca3af; }
.callout-gray .callout-title { color: #d1d5db; }
`;

export const DARK_ELEGANT_COVER_CSS = `
.ob2red-cover { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; text-align: center; padding: 60px 40px; background: #1A1A2E; }
.ob2red-cover-title { font-size: 56px; font-weight: 900; line-height: 1.35; color: #FFFFFF; margin-bottom: 28px; max-width: 100%; }
.ob2red-cover-divider { width: 80px; height: 4px; background: #7C3AED; border-radius: 2px; margin: 20px 0; }
.ob2red-cover-subtitle { font-size: 28px; color: #A0A0C0; margin-top: 12px; line-height: 1.6; }
.ob2red-cover-meta { font-size: 26px; color: #8888AA; margin-top: 16px; line-height: 1.8; }
.ob2red-cover-author { font-size: 28px; font-weight: 500; color: #C0C0D0; margin-top: 40px; }
`;

export const DARK_ELEGANT_END_CSS = `
.ob2red-end { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; text-align: center; padding: 60px 40px; background: #1A1A2E; }
.ob2red-end-thanks { font-size: 44px; font-weight: 700; color: #FFFFFF; margin-bottom: 24px; }
.ob2red-end-cta { font-size: 28px; color: #A0A0C0; margin-bottom: 40px; line-height: 1.6; }
.ob2red-end-author { font-size: 28px; font-weight: 500; color: #C0C0D0; }
.ob2red-end-divider { width: 60px; height: 3px; background: #7C3AED; border-radius: 2px; margin: 20px 0; }
`;
