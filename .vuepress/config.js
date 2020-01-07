module.exports = {
    base: '/vuepress-theme-talltotal/',
    title: 'vuepress-theme-talltotal',
    description: 'demo',
    markdown: {
        lineNumbers: true,
        toc: {
            includeLevel: [1, 2, 3, 4],
        },
    },
    theme: '/../packages',
    themeConfig: {
        logo: '/imgs/logo.png',
        nav: [
            { text: '首页', link: '/' },
            { text: '测试', link: '/test/demo.html' },
            { text: 'github', link: 'https://github.com/talltotal/vuepress-theme-talltotal' },
        ],
        listAllSidebar: {
            ignore: ['/packages', '/node_modules'],
            showIndex: 'Home',
            modules: ['/test/'],
            groupByDir: true,
        },
        sidebar: 'auto',
        lastUpdated: '最后更新',
    }
}
