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
        extractHeaders: ['h2', 'h3', 'h4'],
        externalLinks: {
            target: '_blank', rel: 'noopener noreferrer'
        }
    },
    head: [
        ['meta', {name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no'}],
        ['link', {rel: 'shortcut icon', type: "image/x-icon", href: `/favicon.ico`}],
        ['script', {}, `
            var _hmt = _hmt || [];
            (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?41ab901a72ed35133011901f6333f003";
            var s = document.getElementsByTagName("script")[0]; 
            s.parentNode.insertBefore(hm, s);

            // 引入谷歌,不需要可删除这段
            var hm1 = document.createElement("script");
            hm1.src = "https://www.googletagmanager.com/gtag/js?id=UA-126970002-4";
            var s1 = document.getElementsByTagName("script")[0]; 
            s1.parentNode.insertBefore(hm1, s1);
            })();

            // 谷歌加载,不需要可删除
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-126970002-4');
        `]
    ],
    locales: {
        // 键名是该语言所属的子路径
        // 作为特例，默认语言可以使用 '/' 作为其路径。
        '/': {
            lang: 'zh-CN',
            // 多语言下拉菜单的标题
            selectText: '选择语言',
            // 该语言在下拉菜单中的标签
            label: '简体中文',
            // serviceWorker: {
            //     updatePopup: {
            //         message: "发现新内容可用.",
            //         buttonText: "刷新"
            //     }
            // },
        },
        '/en/': {
            lang: 'en-US'
        }
    },
    themeConfig: {
        type: 'blog',
        authorAvatar: '/touxiang.jpg',
        dateFormat: 'YYYY-MM-DD HH:mm:ss',
        activeHeaderLinks: false,
        nav: [
            {text: '首页', link: '/', icon: 'reco-home'},
            {text: 'Python', link: '/categories/python/', icon: 'reco-category'},
            {text: 'Linux', link: '/categories/linux/', icon: 'reco-category'},
            {text: '前端', link: '/categories/frontend', icon: 'reco-api'},
            {text: '时间轴', link: '/timeline/', icon: 'reco-date'},
            {text: '关于本站', link: '/about/', icon: 'reco-document'},
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
        plugins: [
            ['vuepress-plugin-baidu-autopush'],
            ['vuepress-plugin-code-copy', true],
                ["vuepress-plugin-nuggets-style-copy", {
                copyText: "复制代码",
                tip: {
                    content: "复制成功!"
                }
            }],
            ['@vuepress/pwa', {
                serviceWorker: true,
                updatePopup: {
                    message: "发现新内容可用",
                    buttonText: "刷新"
                }
            }],
            // ['@vuepress/pwa'],
            [
                '@vuepress/medium-zoom', {
                selector: ".page img",
                options: {
                    margin: 16,
                    background: "#202124de",
                    scrollOffset: 0
                }
            }
            ],
            [
                '@vuepress/google-analytics',
                {
                    'ga': 'UA-126970002-4' // UA-00000000-0
                }
            ],
            [
                'sitemap', {
                "hostname": 'https://tangjiuyang.com',
                "exclude": ['/404.html'],
            }
            ],
            [
                'copyright',
                {
                    noCopy: true, // 选中的文字将无法被复制
                    minLength: 100, // 如果长度超过 100 个字符
                    clipboardComponent: "请注明文章出处, [九阳博客](https://tangjiuyang.com)"
                },
            ],
            [
                '@vuepress/last-updated',
                {
                    transformer: (timestamp, lang) => {
                        // 不要忘了安装 moment
                        const moment = require('moment')
                        moment.locale(lang)
                        // return moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
                        return moment(timestamp).fromNow()
                    },
                }],
        ],
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
