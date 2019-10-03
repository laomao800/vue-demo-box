<template>
  <div class="db__wrapper" :class="{ 'db__wrapper--expand': expand }">
    <div class="db__demo">
      <slot name="demo" />
    </div>
    <div class="db__meta">
      <div v-if="title" class="db__title">{{ title }}</div>
      <div v-if="$slots.default" class="db__description">
        <slot />
      </div>
      <div class="db__actions">
        <div
          v-if="finalPlatform.jsfiddle"
          class="db__icon db__icon-jsfiddle"
          title="jsfiddle"
          @click="jumpTo('jsfiddle')"
        />
        <div
          v-if="finalPlatform.codepen"
          class="db__icon db__icon-codepen"
          title="codepen"
          @click="jumpTo('codepen')"
        />
        <div
          v-if="$slots.code"
          class="db__icon db__icon-code"
          title="code"
          @click="expand = !expand"
        />
      </div>
    </div>
    <div v-if="$slots.code" v-show="expand" class="db__code">
      <slot name="code" />
    </div>
  </div>
</template>

<style src="./style.css"></style>

<script>
import { getCodeSlice } from './utils/helper'
import { goJsfiddle, goCodepen } from './utils/platform'

export default {
  name: 'DemoBox',

  props: {
    title: {
      type: String
    },
    jsfiddle: {
      type: Boolean,
      default: true
    },
    codepen: {
      type: Boolean,
      default: true
    },
    jsRes: {
      type: Array,
      default: () => []
    },
    cssRes: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      expand: false,
      codeSlice: {
        html: '',
        script: '',
        style: ''
      }
    }
  },

  computed: {
    globalConfig() {
      return this.$DEMO_BOX || {}
    },
    finalRes() {
      // prettier-ignore
      const globalJsRes = (this.globalConfig.jsRes || []).filter(res => typeof res === 'string')
      const validJsRes = this.jsRes.filter(res => typeof res === 'string')
      // prettier-ignore
      const globalCssRes = (this.globalConfig.CssRes || []).filter(res => typeof res === 'string')
      const validCssRes = this.cssRes.filter(res => typeof res === 'string')
      return {
        jsRes: Array.from(new Set([...globalJsRes, ...validJsRes])),
        cssRes: Array.from(new Set([...globalCssRes, ...validCssRes]))
      }
    },
    finalPlatform() {
      const { jsfiddle, codepen } = this.globalConfig
      return {
        jsfiddle: jsfiddle === false ? false : this.jsfiddle,
        codepen: codepen === false ? false : this.codepen
      }
    }
  },

  mounted() {
    const sourceCode = this.getSourceCode()
    this.codeSlice = getCodeSlice(sourceCode)
  },

  methods: {
    getSourceCode() {
      if (this.$slots.code && this.$slots.code[0]) {
        return this.$slots.code[0].elm.textContent
      }
      return ''
    },
    jumpTo(platform) {
      switch (platform) {
        case 'jsfiddle':
          goJsfiddle(this.codeSlice, this.finalRes)
          break
        case 'codepen':
          goCodepen(this.codeSlice, this.finalRes)
          break
      }
    }
  }
}
</script>
