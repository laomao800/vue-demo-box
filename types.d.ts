import Vue from 'vue'

declare class Component extends Vue {
  static install (vue: typeof Vue): void
}

declare class DemoBox extends Component {
  /** 区块标题 */
  title: string

  /** 是否显示 jsfiddle 跳转按钮 */
  jsfiddle: boolean

  /** 是否显示 codepen 跳转按钮 */
  codepen: boolean

  /** 外部 js 文件地址 */
  jsRes: string[]

  /** 外部 css 文件地址 */
  cssRes: string[]

  /** 水平布局 */
  horizon: boolean

  /** 代码区 height */
  codeHeight: number | string
}

export default DemoBox
