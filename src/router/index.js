import Vue from 'vue'
import VueRouter from 'vue-router'
import Plans from '../views/pages/Plans.vue'
import Layout from "../views/Layout";
import CreatePlan from "@/views/pages/plan/CreatePlan";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path:'',
        name: 'ListPlans',
        component: Plans,
        meta: {
          header: 'Робота з планами'
        }
      },
    ]
  },
  {
    path: '/plan',
    component: Layout,
    children: [
      {
        path:'create',
        name: 'CreatePlan',
        component: CreatePlan,
        meta: {
          header: 'Створення нового плану'
        }
      }
    ]
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
