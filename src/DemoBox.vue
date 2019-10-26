<template>
  <div
    class="db__wrapper"
    :class="{
      'db__wrapper--expand': expand,
      'db__wrapper--horizon': this.horizon
    }"
  >
    <div class="db__demo-content">
      <div class="db__demo">
        <slot name="demo" />
      </div>
      <div v-if="title || $slots.default" class="db__meta">
        <div v-if="title" class="db__title">{{ title }}</div>
        <div v-if="$slots.default" class="db__description">
          <slot />
        </div>
      </div>
    </div>
    <div class="db__code-content">
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
      <div
        v-if="$slots.code"
        v-show="expand || horizon"
        :style="{
          height: _codeHeight
        }"
        class="db__code"
      >
        <slot name="code" />
      </div>
    </div>
  </div>
</template>

<script>
import parseSize from '@laomao800/parse-size-with-unit'
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
    },
    horizon: {
      type: Boolean,
      default: false
    },
    codeHeight: {
      type: [String, Number]
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
      const globalJsRes = this.globalConfig.jsRes || []
      const globalCssRes = this.globalConfig.cssRes || []
      return {
        jsRes: Array.from(new Set([...globalJsRes, ...this.jsRes])),
        cssRes: Array.from(new Set([...globalCssRes, ...this.cssRes]))
      }
    },
    finalPlatform() {
      const { jsfiddle, codepen } = this.globalConfig
      return {
        jsfiddle: jsfiddle === false ? false : this.jsfiddle,
        codepen: codepen === false ? false : this.codepen
      }
    },
    _codeHeight() {
      return parseSize(this.codeHeight)
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

<style src="./style.css"></style>
