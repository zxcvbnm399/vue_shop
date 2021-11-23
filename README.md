# vue_shop

电商后台管理系统的技术选型
1、前端项目技术栈
Vue
Vue-router
Element-UI
Axios
Echarts

2、后端项目技术栈
Node.js
Express
Jwt 状态保持工具，模拟Seession登录记录功能
Mysql
Sequelize 操作数据库的框架



修改点：

1.原本的订单本地接口响应失败，重新在网上找另外一个api接口，请求拦截器请求拦截修改一下根地址，响应回来重新渲染数据出来。订单对应请求换的根路径可在orders组件查看。



2.发布模式出现时间轴Timeline和TimelineItem报错
在入口文件导入并注册全局组件即可
// 时间轴导入
import Timeline from './plugins/timeline/index.js'
import TimelineItem from './plugins/timeline-item/index.js'

// 时间轴注册组件
Vue.use(Timeline)
Vue.use(TimelineItem)



3.![Echart不显示图形](C:\Users\10303\Desktop\实战过程中遇到的问题及解决方式\Echart不显示图形.PNG)





4.![Trailing spaces not allowed no-trailing-spaces](C:\Users\10303\Desktop\实战过程中遇到的问题及解决方式\Trailing spaces not allowed no-trailing-spaces.PNG)
