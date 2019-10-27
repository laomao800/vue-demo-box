import fs from 'fs'
import path from 'path'
import { mount } from '@vue/test-utils'
import { __RewireAPI__ as RewireAPI } from '@/utils/platform.js'
import { getCodeSlice } from '@/utils/helper'
import DemoBox from '@/'

const _getBrowserRunableJS = RewireAPI.__get__('_getBrowserRunableJS')

describe('_getBrowserRunableJS', () => {
  it('_getBrowserRunableJS - normal js', () => {
    const code = `var a = 1;var b = a + 1;`
    expect(_getBrowserRunableJS(code)).toBe(
      `
var a = 1;var b = a + 1;
new Vue().$mount('#app')
    `.trim()
    )
  })

  it('_getBrowserRunableJS - module js', () => {
    const code = `
export default {
  name: 'componentName'
}
      `.trim()
    expect(_getBrowserRunableJS(code)).toBe(
      `
var Main = {
  name: 'componentName'
}
var Ctor = Vue.extend(Main)
new Ctor().$mount('#app')
      `.trim()
    )
  })
})

describe('Helper jumping form', () => {
  window.HTMLFormElement.prototype.submit = () => {}
  const submitForm = RewireAPI.__get__('_submitForm')
  const $form = submitForm({
    url: 'test url',
    data: {
      param1: 'text',
      param2: JSON.stringify({ sub: 1 }),
      param3: undefined
    }
  })

  it('param1', () => {
    expect($form.querySelector('input[name=param1]').value).toBe('text')
  })

  it('param2', () => {
    expect($form.querySelector('input[name=param2]').value).toBe('{"sub":1}')
  })

  it('param3', () => {
    expect($form.querySelector('input[name=param3]').value).toBe('undefined')
  })
})

describe('Jump to platform', () => {
  const vueComponentCode = fs.readFileSync(
    path.resolve(__dirname, './vueComponent.vue'),
    'utf8'
  )
  const { html, script, style } = getCodeSlice(vueComponentCode)

  const wrapper = mount(DemoBox, {
    propsData: {
      jsRes: ['js1', 'js2'],
      cssRes: ['css1', 'css2']
    },
    slots: {
      code: `
        <div v-pre>
          ${vueComponentCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </div>
      `
    }
  })
  const $jsfiddle = wrapper.find('.db__icon-jsfiddle')
  const $codepen = wrapper.find('.db__icon-codepen')

  it('jsfiddle', () => {
    const submitMock = jest.fn()
    RewireAPI.__Rewire__('_submitForm', submitMock)
    $jsfiddle.element.click()
    expect(submitMock.mock.calls[0][0]).toEqual({
      url: 'https://jsfiddle.net/api/post/library/pure/',
      data: {
        wrap: 'b',
        html: `<div id="app">\n${html}\n</div>`,
        js: _getBrowserRunableJS(script),
        css: style,
        resources: 'css1,css2,js1,js2'
      }
    })
  })

  it('codepen', () => {
    const submitMock = jest.fn()
    RewireAPI.__Rewire__('_submitForm', submitMock)
    $codepen.element.click()
    expect(submitMock.mock.calls[0][0]).toEqual({
      url: 'https://codepen.io/pen/define/',
      data: {
        data: JSON.stringify({
          html: `<div id="app">\n${html}\n</div>`,
          js: _getBrowserRunableJS(script),
          css: style,
          js_external: 'js1;js2',
          css_external: 'css1;css2'
        })
      }
    })
  })
})
