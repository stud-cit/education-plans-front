import Vue from 'vue'
import VueRouter from 'vue-router'
import Plans from '../views/pages/Plans.vue'
import Layout from "../views/Layout";
import CreatePlan from "@/views/pages/plan/CreatePlan";
import Settings from '@/views/pages/settings/Settings';
import RestrictionEditor from '@/views/pages/settings/RestrictionEditor/RestrictionEditor';

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
    path: '/settings',
    component: Layout,
    children: [{
      path: '',
      name: 'Settings',
      component: Settings,
      meta: {
        header: 'Налаштування'
      }
    }]
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  },
  {
    path: '/settings/restriction-editor',
    component: Layout,
    children: [{
      path: '',
      name: 'RestrictionEditor',
      component: RestrictionEditor,
      meta: {
        header: 'Редактор обмежень'
      }
    },
    {
      path:'create',
      name: 'RestrictCreate',
      component: () => import('@/views/pages/settings/RestrictionEditor/create'),
      meta: { header: 'Додавання налаштувань' }
    },
    {
      path: ':id',
      params: 'name',
      name: 'RestrictEdit',
      meta: {header: 'Редагування'},
      component: () => import('@/views/pages/settings/RestrictionEditor/edit'),
      beforeEnter: (to, from, next) => {
        if (/^[0-9]+$/.test(to.params.id)) {
          next();
        }
        else {
          next('/');
        }
      },
    },
  ]

  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
