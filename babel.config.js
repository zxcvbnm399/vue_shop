// 项目发布阶段需要用到的 babel 插件
// development是开发阶段
// production是发布阶段
// 使用babel插件移除console.log()
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 展开运算符 发布产品时候的插件数组
    ...prodPlugins,
    // 声明路由懒加载插件
    '@babel/plugin-syntax-dynamic-import'
  ]
}
