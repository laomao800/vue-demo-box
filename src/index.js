import DemoBox from './DemoBox'

DemoBox.install = function(Vue, options = {}) {
  Vue.component(DemoBox.name, DemoBox)
  Vue.prototype.$DEMO_BOX = options
}

if (typeof window !== 'undefined' && window.Vue) {
  DemoBox.install(window.Vue)
}

export default DemoBox
