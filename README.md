# vuepress-theme-talltotal

根据配置自动生成菜单：

```js
{
    themeConfig: {
        // 定义自动生成
        sidebar: 'auto',
        // 配置
        listAllSidebar: {
            // 不在左菜单中显示的文件，打开当前文件时也不会显示左菜单
            ignore: ['/dist/'],
            // 归组做一级目录，key为一级目录名；不归属任何组的页面列在组后
            group: {
                '页面': ['/src/views/'],
                '组件': ['/src/components/'],
            },
        },
    }
}
{
    themeConfig: {
        sidebar: 'auto',
        listAllSidebar: {
            // 模块内的 README.md 目录名，不设置时不会显示在菜单栏，设置时此项会列在左菜单的第一个
            showIndex: 'home',
            // 定义模块，模块内的页面左菜单一致；不归属任何模块的页面合并为一个模块
            modules: ['/work/', '/docs/'],
            // 以文件结构为组，文件夹名为一级目录名，目前最多支持2级；为 true 时，group 配置无效
            groupByDir: true,
        },
    }
}
```
