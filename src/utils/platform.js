/**
 * https://docs.jsfiddle.net/api/display-a-fiddle-from-post
 */
export function goJsfiddle({ html, script, style }, { jsRes, cssRes }) {
  const htmlTpl = `<div id="app">\n${html}\n</div>`
  const jsTpl = _getBrowserRunableJS(script)
  // prettier-ignore
  const resources = [
    ..._normalizeRes(cssRes),
    ..._normalizeRes(jsRes)
  ].join(',')
  _submitForm({
    url: 'https://jsfiddle.net/api/post/library/pure/',
    data: {
      wrap: 'b',
      html: htmlTpl,
      js: jsTpl,
      css: style,
      resources
    }
  })
}

/**
 * https://blog.codepen.io/documentation/api/prefill/
 */
export function goCodepen({ html, script, style }, { jsRes, cssRes }) {
  const htmlTpl = `<div id="app">\n${html}\n</div>`
  const jsTpl = _getBrowserRunableJS(script)
  const data = {
    html: htmlTpl,
    js: jsTpl,
    css: style,
    js_external: _normalizeRes(jsRes).join(';'),
    css_external: _normalizeRes(cssRes).join(';')
  }
  _submitForm({
    url: 'https://codepen.io/pen/define/',
    data: {
      data: JSON.stringify(data)
    }
  })
}

function _submitForm({ url, data = {} }) {
  const $form = document.createElement('form')
  $form.action = url
  $form.method = 'POST'
  $form.target = '_blank'
  $form.style.display = 'none'

  Object.entries(data).forEach(([key, value]) => {
    const $input = document.createElement('input')
    $input.setAttribute('name', key)
    $input.setAttribute('value', value)
    $input.setAttribute('type', 'hidden')
    $form.appendChild($input)
  })

  document.body.appendChild($form)
  $form.onsubmit = () => document.body.removeChild($form)
  $form.submit()
}

function _normalizeRes(res) {
  return Array.isArray(res) ? res.filter(res => typeof res === 'string') : []
}

function _getBrowserRunableJS(script) {
  const code = (script || '')
    .replace(/export\s+default\s*/, 'var Main = ')
    .trim()
  return code
    ? `${code}\n\nvar Ctor = Vue.extend(Main)\nnew Ctor().$mount('#app')`
    : "new Vue().$mount('#app')"
}
