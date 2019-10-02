module.exports = {
  title: 'Vue demo box',
  base: '/vue-demo-box/',
  locales: {
    '/': {
      lang: 'en-US'
    },
    '/zh/': {
      lang: 'zh-CN'
    }
  },
  themeConfig: {
    repo: 'laomao800/vue-demo-box',
    docsDir: 'docs',
    search: false,
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        ariaLabel: 'Select language',
        nav: [
          { text: 'Documentation', link: '/' },
          { text: 'Guide', link: 'guide' },
          { text: 'Example', link: 'example' }
        ],
        sidebar: {
          '/': ['', 'guide', 'example']
        }
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        ariaLabel: '选择语言',
        nav: [
          { text: '基础说明', link: '/zh/' },
          { text: '使用方法', link: 'guide' },
          { text: '效果演示', link: 'example' }
        ],
        sidebar: {
          '/zh/': ['', 'guide', 'example']
        }
      }
    }
  }
}
