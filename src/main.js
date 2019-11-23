import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

//引入table-with-tree
import ZkTable from 'vue-table-with-tree-grid'

import './assets/fonts/iconfont.css'
import './assets/css/global.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
//添加拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios


Vue.component('tree-table', ZkTable)


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
