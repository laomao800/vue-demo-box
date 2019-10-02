/**
 * https://docs.jsfiddle.net/api/display-a-fiddle-from-post
 */
export function goJsfiddle({ html, script, style }, { jsRes, cssRes }) {
  const htmlTpl = `<div id="app">\n${html}\n</div>`
  const vmCode = script.replace(/export\s+default\s*/, '')
  const jsTpl = `var Ctor = Vue.extend(${vmCode})\nnew Ctor().$mount('#app')`
  const resources = [...cssRes, ...getJsResFiles(jsRes)].join(',')
  submitForm({
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
  const vmCode = script.replace(/export\s+default\s*/, '')
  const jsTpl = `var Ctor = Vue.extend(${vmCode})\nnew Ctor().$mount('#app')`
  const data = {
    html: htmlTpl,
    js: jsTpl,
    css: style,
    js_external: getJsResFiles(jsRes).join(';'),
    css_external: cssRes.join(';')
  }
  submitForm({
    url: 'https://codepen.io/pen/define/',
    data: {
      data: JSON.stringify(data)
    }
  })
}

function submitForm({ url, data = {} }) {
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

function getJsResFiles(jsRes) {
  const files = []
  if (Array.isArray(jsRes)) {
    jsRes.forEach(res => {
      if (typeof res === 'string') {
        files.push(res)
      }
    })
  }
  return files
}
