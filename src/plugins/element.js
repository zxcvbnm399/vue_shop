import Vue from 'vue'
// 优化代码，优化导入形式
import { Button, Form, FormItem, Input } from 'element-ui'
//导入弹框提示组件
import { Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// Message需要进行全局挂载，$message是自定义属性，这样每个组件中都可以使用this点$message调用
Vue.prototype.$message = Message
