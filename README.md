
增加的配置：

```js
{
    themeConfig: {
        listAllSidebar: {
            ignore: ['/dist/'],
            group: {
                '页面': ['/src/views/'],
                '组件': ['/static/'],
            },
        },
        sidebar: 'auto',
    }
}
```
