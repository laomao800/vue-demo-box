import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'
import { uglify } from 'rollup-plugin-uglify'
import url from 'postcss-url'
import autoprefixer from 'autoprefixer'

const version = process.env.VERSION || require('./package.json').version
const banner =
  '/**\n' +
  ' * @preserve\n' +
  ` * @laomao800/vue-demo-box v${version}\n` +
  ' */'

const commonConfig = {
  input: 'src/index.js',
  plugins: [
    resolve(),
    commonjs(),
    vue({
      style: {
        trim: false,
        postcssPlugins: [url({ url: 'inline' }), autoprefixer()]
      }
    }),
    buble()
  ]
}

export default [
  {
    ...commonConfig,
    output: {
      format: 'cjs',
      file: 'dist/vue-demo-box.common.js',
      banner
    }
  },
  {
    ...commonConfig,
    output: {
      format: 'umd',
      file: 'dist/vue-demo-box.umd.js',
      name: 'vue-demo-box',
      banner
    }
  },
  {
    ...commonConfig,
    output: {
      format: 'umd',
      file: 'dist/vue-demo-box.umd.min.js',
      name: 'vue-demo-box',
      banner
    },
    plugins: [
      ...commonConfig.plugins,
      uglify({
        output: {
          // https://github.com/TrySound/rollup-plugin-uglify#comments
          comments: function (node, comment) {
            if (comment.type === "comment2") {
              return /@preserve|@license|@cc_on/i.test(comment.value)
            }
            return false
          }
        }
      })
    ]
  }
]
