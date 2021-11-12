import Vue from 'vue'
import VueRouter from 'vue-router'

// 懒加载方式导入组件
// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Login.vue')

// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Welcome.vue')


// import Users from '../components/user/Users.vue'
const Users = () => import(/* webpackChunkName:"Users_Rights_Roles" */ '../components/user/Users.vue')
// import Rights from '../components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName:"Users_Rights_Roles" */ '../components/power/Rights.vue')
// import Roles from '../components/power/Roles.vue'
const Roles = () => import(/* webpackChunkName:"Users_Rights_Roles" */ '../components/power/Roles.vue')



// import Cate from '../components/goods/Cate.vue'
const Cate = () => import(/* webpackChunkName:"Cate_Params" */ '../components/goods/Cate.vue')
// import Params from '../components/goods/Params.vue'
const Params = () => import(/* webpackChunkName:"Cate_Params" */ '../components/goods/Params.vue')



// import List from '../components/goods/List.vue'
const List = () => import(/* webpackChunkName:"List_Add" */ '../components/goods/List.vue')
// import Add from '../components/goods/Add.vue'
const Add = () => import(/* webpackChunkName:"List_Add" */ '../components/goods/Add.vue')



// import Order from '../components/order/Order.vue'
const Order = () => import(/* webpackChunkName:"Order_Report" */ '../components/order/Order.vue')
// import Report from '../components/report/Report.vue'
const Report = () => import(/* webpackChunkName:"Order_Report" */ '../components/report/Report.vue')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/', redirect: '/login'
    },
    {
      path: '/login', component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: List },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }
      ]
    }
  ]
})

// eslint-disable-line拿到路由对象挂载befeach这个 路由导航守卫 控制访问权限
router.beforeEach((to, from, next) => {
  // eslint-disable-line to 将要访问的路径
  // eslint-disable-line from 代表从哪个路径跳转而来
  // eslint-disable-line next 是一个函数，表示放行
  //  next() 表示放行 next('/login') 表示强制跳转
  if (to.path === '/login') return next()
  // eslint-disable-line    获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
