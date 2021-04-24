import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import '../src/assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'//为axios配置请求根路径
Vue.prototype.$http = axios//使每个Vue组件可通过this都能直接访问$http，发起请求

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
