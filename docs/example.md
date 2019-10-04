# Example

<!-- markdownlint-disable MD033 -->
<style>.db__wrapper { margin-top: 16px; }</style>

## Handling User Input

<demo-box title="Handling User Input" :js-res="['//unpkg.com/vue/dist/vue.js']" horizon code-height="300">

> From Vue.js documentation [Handling User Input](https://vuejs.org/v2/guide/index.html#handling-user-input)

To let users interact with your app, we can use the v-on directive to attach event listeners that invoke methods on our Vue instances.

<reverse-message slot="demo" />

<template slot="code">

<<< docs/.vuepress/components/reverse-message.vue

</template>

</demo-box>

## InputNumber

<!-- prettier-ignore -->
<demo-box
  title="InputNumber"
  :js-res="[
    '//unpkg.com/vue/dist/vue.js',
    '//unpkg.com/element-ui@2.12.0/lib/index.js'
  ]"
  :css-res="['//unpkg.com/element-ui@2.12.0/lib/theme-chalk/index.css']">

> From [Element-ui input number](https://element.eleme.cn/#/en-US/component/input-number#basic-usage)

Bind a variable to `v-model` in `<el-input-number>` element and you are set.

<element-input-number slot="demo" />

<template slot="code">

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

</template>

</demo-box>
