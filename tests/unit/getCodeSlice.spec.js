import fs from 'fs'
import path from 'path'
import { getCodeSlice } from '@/utils/helper'

const vueComponentCode = fs.readFileSync(
  path.resolve(__dirname, './vueComponent.vue'),
  'utf8'
)

describe('Code slice', () => {
  const { html, script, style } = getCodeSlice(vueComponentCode)

  it('html', () => {
    expect(html).toBe(
      `
<template>
  <div>
    <p class="message">{{ message }}</p>
    <button v-on:click="reverseMessage">
      reverseMessage
    </button>
  </div>
</template>
      `.trim()
    )
  })
  it('script', () => {
    expect(script).toBe(
      `
export default {
  data() {
    return {
      message: 'Hello Vue.js!'
    }
  },
  methods: {
    reverseMessage() {
      this.message = this.message
        .split('')
        .reverse()
        .join('')
    }
  }
}
    `.trim()
    )
  })
  it('style', () => {
    expect(style).toBe(
      `
.message {
  font-size: 14px;
  color: red;
}
      `.trim()
    )
  })
})
