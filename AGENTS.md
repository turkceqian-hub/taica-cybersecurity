# AGENTS.md - TAICA AI 資安專案開發指南

本文件旨在為參與本專案協作的 AI Agent（如 Claude Code, Cursor, Copilot 等）提供清晰的專案上下文、架構規範、程式風格與延伸擴充指引。

---

## 1. 專案概述 (Project Overview)
- **專案名稱**：TAICA AI 資安應用專案 (TAICA Cybersecurity)
- **專案目的**：提供現代化、直觀且互動性高的資訊安全與 AI 概念展示平台，協助使用者理解資安防護與威脅情境。
- **核心理念**：輕量、高效、注重互動體驗與可擴充架構。

---

## 2. 技術棧 (Tech Stack)
- **構建工具 (Bundler)**：Vite
- **程式語言**：JavaScript (ESNext) / HTML5 / CSS3
- **代碼品質工具 (Linter)**：Oxlint (`.oxlintrc.json`)
- **部署平台**：Vercel / GitHub Pages

---

## 3. 目錄結構與架構約定 (Directory Structure)
```text
taica-cybersecurity/
├── .github/          # GitHub 工作流程與 Actions
├── public/           # 靜態資源 (圖標、字型、未打包素材)
├── src/              # 專案核心源碼
│   ├── assets/       # 樣式與專案圖片
│   └── main.js       # 核心進入點與互動邏輯
├── .gitignore        # Git 忽略清單
├── .oxlintrc.json    # Oxlint 程式碼檢查規則
├── index.html        # SPA 首頁與主要 DOM 結構
├── package.json      # 專案相依性與腳本
└── vite.config.js    # Vite 設定檔