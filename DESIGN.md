1、使用Figma MCP，以最大深度，阅读设计稿件的所有细节。
2、以如下结构，根据设计稿来编写我的设计系统
--design-system/ # 设计系统主目录
  --components/  # 可复用UI组件
    --Button.jsx
    --Input.jsx
    --Card.jsx
    --index.js   # 统一导出所有组件
  --tokens/      # 设计 Tokens: 颜色、间距、字体大小等
    --colors.js
    --spacing.js
    --typography.js
    --index.js

  --hooks/       # 通用UI hooks(如 useTheme、useFocus)
    --useMediaQuery.js
--index.js       # 顶层导出，方便业务导入整个设计系统

3、完成这一切后，写一个设计系统预览页面，在App.jsx 中展示出来。

验收标准: 最终要求 App.jsx 极为干净。