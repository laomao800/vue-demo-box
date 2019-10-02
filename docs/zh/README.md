---
title: 基础说明
---

# vue-demo-box

<!-- markdownlint-disable MD033 -->

vue-demo-box 为提供一个同时展示实际效果以及代码的容器组件，可用于搭建各文档、演示类场景。更多演示请查看 [效果演示](./example) 。

建议配合 [Vuepress 引入代码段](https://vuepress.vuejs.org/zh/guide/markdown.html#%E5%AF%BC%E5%85%A5%E4%BB%A3%E7%A0%81%E6%AE%B5) 功能使用，可轻松复用代码建立演示效果：

<img :src="$withBase('/preview.png')" alt="vue-demo-box preview" style="width:80%;box-shadow:#ddd 0 0 10px;" />

## 安装

```bash
yarn add -D @laomao800/vue-demo-box

# or

npm install --save-dev @laomao800/vue-demo-box
```

## API

### Props

| prop     | type    | default     | description                |
| -------- | ------- | ----------- | -------------------------- |
| title    | String  | `undefined` | demo 标题                  |
| jsfiddle | Boolean | `true`      | 是否显示 jsfiddle 跳转按钮 |
| codepen  | Boolean | `true`      | 是否显示 codepen 跳转按钮  |
| jsRes    | Array   | `[]`        | 外部 js 文件地址           |
| cssRes   | Array   | `[]`        | 外部 css 文件地址          |

::: tip

其中 `jsRes` 与 `cssRes` 仅在跳转到站外演示平台作为外部资源，在组件内部不会加载相关文件内容。

:::

### Slots

| name    | description      |
| ------- | ---------------- |
| default | 说明区域文字内容 |
| demo    | 演示区域         |
| code    | 代码区域         |

### 预配置

在全局引入时也可对组件进行全局配置，会生效于所有实例上，支持的 props ：

| prop     | description                             |
| -------- | --------------------------------------- |
| jsfiddle | 默认开启与否                            |
| codepen  | 默认开启与否                            |
| jsRes    | 默认资源，会与实例传入的 props 内容合并 |
| cssRes   | 默认资源，会与实例传入的 props 内容合并 |

```js
import Vue from 'vue'
import DemoBox from '@laomao800/vue-demo-box'

Vue.use(DemoBox)

/*
Vue.use(DemoBox, {
  jsfiddle: false,
  codepen: true,
  jsRes: [
    '//unpkg.com/vue/dist/vue.js',
    '//unpkg.com/element-ui@2.12.0/lib/index.js'
  ],
  cssRes: [
    '//unpkg.com/element-ui@2.12.0/lib/theme-chalk/index.css'
  ]
})
*/
```
