import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue' 
import WelCome from '../components/WelCome.vue' 
import Users from '../components/user/Users.vue'
import Permission from '../components/permission/Permission.vue'
import Roles from '../components/permission/Roles.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { 
    path: '/home', 
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: WelCome },
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Permission }
    ]
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if(to.path == '/login') {
    return next() 
  }

  //获取token
  const token = window.sessionStorage.getItem('token') 
  if(!token) return next('/login')
  next()
})


export default router
