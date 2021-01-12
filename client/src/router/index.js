import Vue from 'vue'
import VueRouter from 'vue-router'
import Reports from '../views/Reports.vue'
import Devices from '../views/Devices.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'reports',
    component: Reports
  },
  {
    path: '/devices',
    name: 'Devices',
    component: Devices
  }
]

const router = new VueRouter({
  routes
})

export default router
