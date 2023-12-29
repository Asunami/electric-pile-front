import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../layout/layout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/login/register.vue'),
  },
  //首页相关
  {
    path: '',
    component: Layout,
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index.vue')
    }]
  },
  //个人中心相关
  {
    path: '/private',
    component: Layout,
    children: [
      {
        path: 'updateInfo',
        name: 'updateInfo',
        component: () => import('@/views/private/updateInfo.vue')
      },
      {
        path: 'consumption',
        name: 'consumption',
        component: () => import('@/views/private/consumption.vue')
      },
      {
        path: 'recharge',
        name: 'recharge',
        component: () => import('@/views/private/recharge.vue')
      },
      {
        path: 'reservation',
        name: 'reservation',
        component: () => import('@/views/private/reservation.vue')
      },
      {
        path: 'orderItem',
        name: 'orderItem',
        component: () => import('@/views/private/orderItem.vue')
      },
    ]
  },
  //电站相关
  {
    path: '/station',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/station/list.vue')
      },
      {
        path: 'detail',
        name: 'sdetail',
        component: () => import('@/views/station/detail.vue')
      },
      {
        path: 'map',
        name: 'map',
        component: () => import('@/views/station/map.vue')
      },
    ]
  },
  //充电桩相关
  {
    path: '/pile',
    component: Layout,
    children: [
      {
        path: 'detail',
        name: 'pdetail',
        component: () => import('@/views/pile/detail.vue')
      },
      {
        path: 'charge',
        name: 'charge',
        component: () => import('@/views/pile/charge.vue')
      },
    ]
  },

]

const router = new VueRouter({
  routes
})

export default router
