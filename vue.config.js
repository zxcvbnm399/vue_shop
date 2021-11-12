// 自定义webpack默认配置

module.exports = {
    // 发布模式
    // 链式编程形式
    chainWebpack: config => {
        // config.when判断所处编译模式
        // process.env.NODE_ENV拿到当前编译模式
        config.when(process.env.NODE_ENV === 'production', config => {
            // config.entry()获取打包入口
            config.entry('app').clear().add('./src/main-prod.js')

            // 通过webpack的externals节点，来配置并加载外部的CDN资源，声明在externals中的第三方依赖包，都不会被打包
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            })

            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })
        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')

            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }
}