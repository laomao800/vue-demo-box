export function getCodeSlice(text) {
  const codeSlice = {
    html: '',
    script: '',
    style: ''
  }
  if (text) {
    codeSlice.html = stripTemplate(text)
    codeSlice.script = stripScript(text)
    codeSlice.style = stripStyle(text)
  }
  return codeSlice
}

// fork from https://github.com/ElemeFE/element/blob/dev/examples/util.js
function stripTemplate(content) {
  content = content.trim()
  if (!content) {
    return content
  }
  return content.replace(/<(script|style)[\s\S]+<\/\1>/g, '').trim()
}

function stripScript(content) {
  const result = content.match(/<(script)>([\s\S]+)<\/\1>/)
  return result && result[2] ? result[2].trim() : ''
}

function stripStyle(content) {
  const result = content.match(/<(style)[\s\S]*?>([\s\S]+)<\/\1>/)
  return result && result[2] ? result[2].trim() : ''
}
