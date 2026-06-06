# SonicSight 聆光科技 · 技术体验演示站

> 基于 Cued Speech 的中文 AI 口语训练系统 —— 看见声音，说出清晰的每个字。

面向听障儿童与唇腭裂术后患者的多模态发音训练系统的**技术体验演示**。
纯前端、零后端、零外部 API，可直接托管在 GitHub Pages，国内访问稳定。

## 体验板块

1. **三模态感知** — 打开摄像头，浏览器端实时勾出唇部 40 个关键点与手部发音手势
   （MediaPipe 在本机运行，画面不上传、不联网）。无摄像头时自动回退模拟演示。
2. **时间的秘密** — 交互式时间线，演示 Cued Speech 中“手势领先唇动 144–239ms”的核心难题与对齐。
3. **五维诊断** — 选一个音，当场生成唇形 / 声学 / 时长 / 气流 / 鼻音五维评分与薄弱点诊断，
   并按家长 / 老师 / 孩子三种语气解读。
4. **训练闭环** — 采集 → 评估 → 训练 → 激励 → 复测，五个 Coze 智能体接力的闭环可视化。

## 技术栈

Vite · React 19 · TypeScript · Tailwind CSS v4 · framer-motion · Recharts ·
@mediapipe/tasks-vision（自托管 wasm + 模型）。

## 本地开发

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 产物在 dist/
npm run preview  # 本地预览构建产物
```

## 部署

推送到 `main` 分支后，GitHub Actions（`.github/workflows/deploy.yml`）会自动构建并
发布到 GitHub Pages。需在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。

构建使用相对路径（`vite.config.ts` 中 `base: './'`），因此在
`https://<用户名>.github.io/<仓库名>/` 子路径下也能正常打开。
