<demo-box
  :js-res="[
    '//unpkg.com/vue/dist/vue.js',
    '//unpkg.com/element-ui@2.12.0/lib/index.js'
  ]"
  :css-res="['//unpkg.com/element-ui@2.12.0/lib/theme-chalk/index.css']">

> 来自 [Element-ui input number](https://element.eleme.cn/#/zh-CN/component/input-number#inputnumber-ji-shu-qi)

要使用它，只需要在 `el-input-number` 元素中使用 `v-model` 绑定变量即可，变量的初始值即为默认值。

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
      num: 1
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
