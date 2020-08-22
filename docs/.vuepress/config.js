module.exports = {
  title: '九阳的博客',
  description: 'In me the tiger sniffs the rose.',
  theme: 'reco',
  blogConfig: {
      category: {
        location: 2,     // 在导航栏菜单中所占的位置，默认2
        text: 'Category' // 默认文案 “分类”
      },
      tag: {
        location: 3,     // 在导航栏菜单中所占的位置，默认3
        text: 'Tag'      // 默认文案 “标签”
      }
    },
  markdown: {
    lineNumbers: true,
    extractHeaders: [ 'h2', 'h3', 'h4' ]
  },
  head: [
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
    ['link', { rel: 'shortcut icon', type: "image/x-icon", href: `/favicon.ico` }]
  ],
  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    '/': {
      lang: 'zh-CN',
    },
      '/en/':{
          lang: 'en-US'
      }
  },
  themeConfig: {
    type: 'blog',
    authorAvatar: '/touxiang.jpg',
    // dateFormat: 'YYYY-MM-DD',
    nav: [
      { text: '首页', link: '/', icon: 'reco-home' },
      { text: 'Python', link: '/categories/python/', icon: 'reco-category' },
      { text: 'Linux', link: '/categories/linux/', icon: 'reco-category' },
      { text: '前端', link: '/categories/frontend', icon: 'reco-api' },
      { text: '时间轴', link: '/timeline/', icon: 'reco-date' },
      { text: '关于本站', link: '/about/', icon: 'reco-document' },
    ],
    // sidebar: [
      // '/',
      // '/python/one',
      // ['/linux', 'Explicit link text']
    // ],
    // 备案
    // record: 'ICP 备案文案',
    // recordLink: 'ICP 备案指向链接',
    // cyberSecurityRecord: '公安部备案文案',
    // cyberSecurityLink: '公安部备案指向链接',
    // 项目开始时间，只填写年份
    startYear: '2017',
    sidebar: 'auto',
    author: '九阳',
    huawei: true,
    lastUpdated: '上次更新',
    plugins: ['@vuepress/medium-zoom'],
    repo: 'yszar/vuepress',
    // repoLabel: '查看源码',
    // 假如你的文档仓库和项目本身不在一个仓库：
    docsRepo: 'yszar/vuepress',
    // 假如文档不是放在仓库的根目录下：
    docsDir: 'docs',
    // 假如文档放在一个特定的分支下：
    docsBranch: 'master',
    // 默认是 false, 设置为 true 来启用
    editLinks: true,
    // 默认为 "Edit this page"
    editLinkText: '在 GitHub 上编辑此页',
    // 页面滚动
    smoothScroll: true,
    friendLink: [
      {
        title: '在线工具',
        desc: '免费提供各种在线工具！',
        email: '56312233@qq.com',
        link: 'https://oltools.net'
      },
      {
        title: 'vuepress-theme-reco',
        desc: 'A simple and beautiful vuepress Blog & Doc theme.',
        logo: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        link: 'https://vuepress-theme-reco.recoluan.com'
      },
      {
        title: '午后南杂',
        desc: 'Enjoy when you can, and endure when you must.',
        email: 'recoluan@qq.com',
        link: 'https://www.recoluan.com'
      },
      // ...
    ]
  }
}
