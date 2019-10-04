<demo-box
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
