# 效果演示

<!-- markdownlint-disable MD033 -->

## 处理用户输入

<demo-box title="处理用户输入" :js-res="['//unpkg.com/vue/dist/vue.js']">

> 来自 Vue.js 官方文档 [处理用户输入](https://cn.vuejs.org/v2/guide/#%E5%A4%84%E7%90%86%E7%94%A8%E6%88%B7%E8%BE%93%E5%85%A5)

为了让用户和你的应用进行交互，我们可以用 `v-on` 指令添加一个事件监听器，通过它调用在 Vue 实例中定义的方法。

<reverse-message slot="demo" />

<div slot="code">

<<< docs/.vuepress/components/reverse-message.vue

</div>

</demo-box>

## InputNumber 计数器

<!-- prettier-ignore -->
<demo-box
  title="InputNumber 计数器"
  :js-res="[
    '//unpkg.com/vue/dist/vue.js',
    '//unpkg.com/element-ui@2.12.0/lib/index.js'
  ]"
  :css-res="['//unpkg.com/element-ui@2.12.0/lib/theme-chalk/index.css']">

> 来自 [Element-ui input number](https://element.eleme.cn/#/zh-CN/component/input-number#inputnumber-ji-shu-qi)

要使用它，只需要在 `el-input-number` 元素中使用 `v-model` 绑定变量即可，变量的初始值即为默认值。

<element-input-number slot="demo" />

<div slot="code">

```vue
<template>
  <el-input-number v-model="num" :min="1" :max="10" @change="handleChange" />
</template>

<script>
export default {
  data() {
    return {
      num: 2
    }
  },
  methods: {
    handleChange(value) {
      console.log(value)
    }
  }
}
</script>
```

</div>

</demo-box>
