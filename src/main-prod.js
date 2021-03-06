import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
// 导入全局样式表
import '../src/assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 时间轴导入
import Timeline from './plugins/timeline/index.js'
import TimelineItem from './plugins/timeline-item/index.js'

// 导入 NProgress 包对应的js和css
// 实现效果
import NProgress from 'nprogress'


import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'//为axios配置请求根路径

// axios请求拦截，相当于预处理这次请求
axios.interceptors.request.use(config => {
    if (window.sessionStorage.getItem('activePath') !== '/orders') {
        // 在request拦截器中，展示进度条NProgress.start()
        NProgress.start()
        // console.log(config)
        // 为请求头对象，添加Token验证的Authorization
        config.headers.Authorization = window.sessionStorage.getItem('token')
        //最后必须 return config
        return config
    } else {
        // 在request拦截器中，展示进度条NProgress.start()
        NProgress.start()
        config.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
        // console.log(config)
        // 为请求头对象，添加Token验证的Authorization
        config.headers.Authorization = window.sessionStorage.getItem('token')
        //最后必须 return config
        return config
    }
})
// 在response拦截器中隐藏进度条NProgress.done(),use回调函数拿到配置对象config
axios.interceptors.response.use(config => {
    NProgress.done()
    return config
})

Vue.prototype.$http = axios//使每个Vue组件可通过this都能直接访问$http，发起请求

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)

// 时间轴注册组件
Vue.use(Timeline)
Vue.use(TimelineItem)
// 时间过滤器
Vue.filter('dateFormat', function (originVal) {
    const dt = new Date(originVal)

    const y = dt.getFullYear()
    // padStart函数作用长度不足两位，前面补0
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')


    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
