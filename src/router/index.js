import Vue from 'vue'
import VueRouter from 'vue-router'
import Plans from '../views/pages/Plans.vue'
import Layout from "../views/Layout";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [{
      path:'',
      name: 'ListPlans',
      component: Plans,
    }]
  },
  {
    path: '/about',
    component: Layout,
    children: [{
      path: 'dashboard',
      name: 'About',
      component: () => import('../views/About'),
    }]
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
