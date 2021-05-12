import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import '../src/assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'//为axios配置请求根路径
// axios请求拦截，相当于预处理这次请求
axios.interceptors.request.use(config => {
  // console.log(config)
  // 为请求头对象，添加Token验证的Authorization
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //最后必须 return config
  return config
})
Vue.prototype.$http = axios//使每个Vue组件可通过this都能直接访问$http，发起请求

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
