import Vue from 'vue'
import { Message, Form, FormItem, Input, Button } from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

Vue.component(Message)
Vue.prototype.$message = Message