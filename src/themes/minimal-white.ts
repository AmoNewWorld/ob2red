const BASE_CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
`;

export const MINIMAL_WHITE_CSS = `${BASE_CSS}
body, .ob2red-page-content, .ob2red-measure-root {
  font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", "Hiragino Sans GB", sans-serif;
  font-size: 28px;
  line-height: 1.85;
  color: #1a1a1a;
  background: #ffffff;
  -webkit-font-smoothing: antialiased;
}
h1 { font-size: 46px; font-weight: 900; line-height: 1.4; margin-bottom: 20px; color: #111; letter-spacing: -0.5px; }
h2 { font-size: 38px; font-weight: 700; line-height: 1.45; margin-top: 28px; margin-bottom: 16px; color: #111; padding-bottom: 10px; border-bottom: 3px solid #f0f0f0; }
h3 { font-size: 33px; font-weight: 700; line-height: 1.5; margin-top: 22px; margin-bottom: 12px; color: #222; }
h4, h5, h6 { font-size: 30px; font-weight: 600; line-height: 1.5; margin-top: 18px; margin-bottom: 10px; color: #333; }
p { margin-bottom: 18px; text-align: justify; }
strong { font-weight: 700; color: #d63031; }
em { font-style: italic; color: #636e72; }
blockquote { margin: 18px 0; padding: 16px 20px; background: #f8f9fa; border-left: 5px solid #2563eb; border-radius: 0 8px 8px 0; color: #444; font-size: 26px; line-height: 1.8; }
blockquote p { margin-bottom: 8px; }
blockquote p:last-child { margin-bottom: 0; }
ul, ol { margin: 14px 0; padding-left: 36px; }
li { margin-bottom: 10px; line-height: 1.75; }
li::marker { color: #2563eb; font-weight: 700; }
code { font-family: "SF Mono", "Fira Code", "Consolas", monospace; font-size: 24px; background: #f1f3f5; padding: 3px 8px; border-radius: 4px; color: #d63384; }
pre { margin: 18px 0; padding: 20px; background: #1e1e2e; border-radius: 10px; overflow: hidden; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word; }
pre code { background: none; color: #cdd6f4; padding: 0; font-size: 22px; white-space: pre-wrap; word-wrap: break-word; }
table { width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 25px; }
th { background: #2563eb; color: #fff; font-weight: 600; padding: 12px 16px; text-align: left; }
td { padding: 11px 16px; border-bottom: 1px solid #e9ecef; }
tr:nth-child(even) td { background: #f8f9fa; }
hr { border: none; height: 2px; background: #d1d5db; margin: 24px 0; }
img { max-width: 100%; border-radius: 8px; margin: 14px 0; }
a { color: #2563eb; text-decoration: none; border-bottom: 1px dashed #2563eb; }
.callout { margin: 18px 0; padding: 16px 20px; border-radius: 10px; background: #eff6ff; border-left: 5px solid #3b82f6; font-size: 26px; line-height: 1.8; color: #444; }
.callout-title { font-weight: 700; font-size: 27px; margin-bottom: 8px; }
.callout-content p { margin-bottom: 8px; }
.callout-content p:last-child { margin-bottom: 0; }
.callout-blue { background: #eff6ff; border-left-color: #3b82f6; }
.callout-blue .callout-title { color: #2563eb; }
.callout-yellow { background: #fffbeb; border-left-color: #f59e0b; }
.callout-yellow .callout-title { color: #d97706; }
.callout-green { background: #f0fdf4; border-left-color: #22c55e; }
.callout-green .callout-title { color: #16a34a; }
.callout-red { background: #fef2f2; border-left-color: #ef4444; }
.callout-red .callout-title { color: #dc2626; }
.callout-purple { background: #faf5ff; border-left-color: #a855f7; }
.callout-purple .callout-title { color: #9333ea; }
.callout-gray { background: #f8f9fa; border-left-color: #6b7280; }
.callout-gray .callout-title { color: #4b5563; }
`;

export const MINIMAL_WHITE_COVER_CSS = `
.ob2red-cover { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; text-align: center; padding: 60px 40px; background: #ffffff; }
.ob2red-cover-title { font-size: 56px; font-weight: 900; line-height: 1.35; color: #111; margin-bottom: 28px; max-width: 100%; }
.ob2red-cover-divider { width: 80px; height: 4px; background: #2563eb; border-radius: 2px; margin: 20px 0; }
.ob2red-cover-subtitle { font-size: 28px; color: #666; margin-top: 12px; line-height: 1.6; }
.ob2red-cover-meta { font-size: 26px; color: #888; margin-top: 16px; line-height: 1.8; }
.ob2red-cover-author { font-size: 28px; font-weight: 500; color: #555; margin-top: 40px; }
`;

export const MINIMAL_WHITE_END_CSS = `
.ob2red-end { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; text-align: center; padding: 60px 40px; background: #ffffff; }
.ob2red-end-thanks { font-size: 44px; font-weight: 700; color: #111; margin-bottom: 24px; }
.ob2red-end-cta { font-size: 28px; color: #666; margin-bottom: 40px; line-height: 1.6; }
.ob2red-end-author { font-size: 28px; font-weight: 500; color: #555; }
.ob2red-end-divider { width: 60px; height: 3px; background: #2563eb; border-radius: 2px; margin: 20px 0; }
`;
