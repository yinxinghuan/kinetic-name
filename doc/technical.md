# Technical

## 1. 技术栈

Vite 6 + TypeScript、Three.js 0.115、GSAP 和 `three-bmfont-text` 2.3。渲染是原作保留的 WebGL `WebGLRenderTarget` + MSDF 位图文字 + `ShaderMaterial` 流程；页面不使用 React。

## 2. 目录结构

- `src/main.ts`：身份回退、用户名选择、界面闭环与启动。
- `src/upstream/`：从固定 MIT 上游版本保留并最小迁移的 WebGL、字体和 shader 模块。
- `src/assets/`：原作四套位图字体图集和 `.fnt` 描述。
- `src/shared/runtime/bridge.ts`：平台维护的 Aigram iframe bridge 副本。
- `doc/`：需求、视觉、效果捕获及技术文档。
- `public/THIRD_PARTY_NOTICES.txt`：随构建分发的完整 MIT notice。
- `_qa/capture.mjs`：双尺寸图形闭环、长用户名与平台桥真实姓名解析。

## 3. 核心模块

`main.ts` 优先读取 `?user_name=` 调试覆盖；在 Aigram 中通过 canonical `callAigramAPI()` 请求 `/note/telegram/user/get/info/by/telegram_id`，直接读取响应 `data.name`（兼容旧字段 `user_name`），不额外用顶层状态字段阻断已返回的资料；其它环境回退到 `AlterU`。`upstream/gl/Type.js` 将名字渲染进离屏纹理，再让四个原作 shader 映射到不同几何体。`upstream/index.js` 把四个原作配置排成一圈并提供触屏锁定、完成后拖拽观察和重置。渲染器像素密度上限 1.5，文档隐藏时停止 Three clock。

## 4. 扩展点

调整四套原作视觉请改 `src/upstream/options.js` 和 `src/upstream/gl/shaders.js`，但必须重新做视觉基线 QA。更改闭环或手势请改 `src/upstream/index.js`；本地化 copy 在 `index.html` 和 `src/main.ts`；平台身份逻辑只在 `src/main.ts` 调整并保持 bridge 合同不变。发布资产、署名和 meta 分别在 `public/`、`README.md` 与 `meta.json`。

## 5. 启动交接

`index.html` 内联最小启动桥，避免 Vite 模块、身份接口及字体图集抵达前出现空白。`createKineticName()` 暴露 `ready` Promise，等四个 `Type` mesh 全部进入 scene，再由下一帧设置 `body[data-visual-ready=true]` 并淡出启动桥。QA 在受控 420ms 资源延迟下验证两档手机尺寸。
