module.exports = {
    title: 'demo',
    description: 'demo',
    markdown: {
        lineNumbers: true,
        toc: {
            includeLevel: [1, 2, 3, 4],
        },
    },
    theme: '/../packages',
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { text: '测试', link: '/test/demo.html' },
            { text: 'github', link: 'https://github.com/talltotal/vuepress-theme-talltotal' },
        ],
        sidebar: 'auto',
        lastUpdated: '最后更新',
    }
}
