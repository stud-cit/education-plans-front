import Vue from 'vue';
import VueRouter from 'vue-router';
import Plans from '../views/pages/Plans.vue';
import Layout from '../views/Layout';
import CreatePlan from '@/views/pages/plan/CreatePlan';
import Settings from '@/views/pages/settings/Settings';
import RestrictionEditor from '@/views/pages/settings/RestrictionEditor';
import RestrictCreate from '@/views/pages/settings/RestrictionEditor/create';
import RestrictEdit from '@/views/pages/settings/RestrictionEditor/edit';
import StudyTerm from '@/views/pages/settings/StudyTerm';
import FormStudy from '@/views/pages/settings/FormStudy';
import FormOrganization from '@/views/pages/settings/FormOrganization';
import SettingUsers from '@/views/pages/settings/Users/Users';
import SelectiveDisciplines from '@/views/pages/settings/SelectiveDisciplines/SelectiveDisciplines';
import Position from '@/views/pages/settings/Position';
import Note from '@/views/pages/settings/Note';
import NotFoundPage from '@/views/NotFoundPage';
import Forbidden from '@/views/Forbidden';
import Unauthorized from '@/views/Unauthorized';
import PreviewPlan from "@/views/pages/plan/PreviewPlan";
import Login from '@/views/pages/LoginLayout';

Vue.use(VueRouter);
const BREADCRUMBS = {
  SETTINGS: [
    { text: 'Робота з планами', to: { name: 'ListPlans' } },
    { text: 'Налаштування', to: { name: 'Settings'} },
  ]
}

const routes = [
  {
    path: '/login',
    name: 'Login',
    meta: { guest: true },
    component: Login
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'ListPlans',
        component: Plans,
        meta: {
          requiresAuth: true,
          header: 'Робота з планами',
          breadCrumb: [
            { text: 'Робота з планами' }
          ]
        },
      },
    ],
  },
  {
    path: '/plan',
    component: Layout,
    children: [
      {
        path: 'create',
        name: 'CreatePlan',
        component: CreatePlan,
        meta: {
          requiresAuth: true,
          header: 'Створення нового плану',
          breadCrumb: [
            {
              text: 'Робота з планами',
              to: { name: 'ListPlans' }
            },
            {
              text: 'Створення нового плану',
            }
          ]
        },
      },
      {
        path: "edit/:id:title",
        name: "EditPlan",
        component: CreatePlan,
        meta: {
          requiresAuth: true,
          header: "Редагування плану",
          breadCrumb() {
            const paramToPageB = this.$route.params.title;
            return [
              { text: 'Робота з планами', to: { name: 'ListPlans' } },
              { text: paramToPageB}
            ]
          }
        },
      },
      {
        path: "preview/:id:title",
        name: "PreviewPlan",
        component: PreviewPlan,
        meta: {
          requiresAuth: true,
          header: "Попередній перегляд плану",
          breadCrumb() {
            const paramToPageB = this.$route.params.title;
            return [
              { text: 'Робота з планами', to: { name: 'ListPlans' } },
              { text: paramToPageB}
            ]
          }
        },
      },
    ],
  },
  {
    path: '/settings',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Settings',
        component: Settings,
        meta: {
          requiresAuth: true,
          header: 'Налаштування',
          breadCrumb: [
            { text: 'Робота з планами', to: { name: 'ListPlans' } },
            { text: 'Налаштування' }
          ]
        },
      },
      {
        path: 'users',
        name: 'SettingUsers',
        component: SettingUsers,
        meta: {
          requiresAuth: true,
          header: 'Налаштування користувачів',
          breadCrumb: [
            ...BREADCRUMBS.SETTINGS,
            { text: 'Налаштування користувачів' }
          ]
        },
      },
      {
        path: 'form-study',
        name: 'FormStudy',
        component: FormStudy,
        meta: {
          requiresAuth: true,
          header: 'Форма навчання',
          breadCrumb: [
            ...BREADCRUMBS.SETTINGS,
            { text: 'Форма навчання' }
          ]
        },
      },
      {
        path: 'form-organizations',
        name: 'FormOrganization',
        component: FormOrganization,
        meta: {
          requiresAuth: true,
          header: 'Форма організації навчання',
          breadCrumb: [
            ...BREADCRUMBS.SETTINGS,
            { text: 'Форма організації навчання' }
          ]
        },
      },
      {
        path: 'restriction-editor',
        component: () => import('@/views/SimpleLayout'),
        children: [
          {
            path: '',
            name: 'RestrictionEditor',
            component: RestrictionEditor,
            meta: {
              requiresAuth: true,
              header: 'Редактор обмежень',
              breadCrumb: [
                ...BREADCRUMBS.SETTINGS,
                { text: 'Редактор обмежень' }
              ]
            },
          },
          {
            path: 'create',
            name: 'RestrictCreate',
            component: RestrictCreate,
            meta: {
              requiresAuth: true,
              header: 'Додавання налаштувань',
              breadCrumb: [
                ...BREADCRUMBS.SETTINGS,
                { text: 'Редактор обмежень', to: { name: 'RestrictionEditor'} },
                { text: 'Додавання налаштувань' }
              ]
            },
          },
          {
            path: ':id',
            params: ['id'],
            name: 'RestrictEdit',
            meta: {
              requiresAuth: true,
              header: 'Редагування',
              breadCrumb() {
                const paramToPageB = this.$route.params.id;
                return [
                  ...BREADCRUMBS.SETTINGS,
                  { text: 'Редактор обмежень', to: { name: 'RestrictionEditor'} },
                  { text: paramToPageB,
                    to: { params: { paramToPageB: paramToPageB } }
                  },
                  { text: 'Редагування' }
                ]
              }
            },
            component: RestrictEdit,
            beforeEnter: (to, from, next) => {
              if (/^[0-9]+$/.test(to.params.id)) {
                next();
              } else {
                next('/');
              }
            },
          },
        ],
      },

      {
        path: 'study-term',
        name: 'StudyTerm',
        component: StudyTerm,
        meta: {
          requiresAuth: true,
          header: 'Термін навчання',
          breadCrumb: [
            ...BREADCRUMBS.SETTINGS,
            { text: 'Термін навчання' }
          ]
        },
      },
      {
        path: 'selective-disciplines',
        name: 'SelectiveDisciplines',
        component: SelectiveDisciplines,
        meta: {
          requiresAuth: true,
          header: 'Вибіркові дисципліни',
          breadCrumb: [
            ...BREADCRUMBS.SETTINGS,
            { text: 'Вибіркові дисципліни' }
          ]
        },
      },
      {
        path: 'position',
        name: 'Position',
        component: Position,
        meta: {
          requiresAuth: true,
          header: 'Посади',
          breadCrumb: [
            ...BREADCRUMBS.SETTINGS,
            { text: 'Посади' }
          ]
        },
      },
      {
        path: 'notes',
        name: 'Note',
        component: Note,
        meta: {
          requiresAuth: true,
          header: 'Примітки',
          breadCrumb: [
            ...BREADCRUMBS.SETTINGS,
            { text: 'Примітки' }
          ]
        },
      },
    ],
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  },
  {
    path: '*',
    name: 'NotFoundPage',
    component: NotFoundPage,
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: Forbidden
  },
  {
    path: '/401',
    name: 'Unauthorized',
    component: Unauthorized
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localStorage.getItem("authToken")) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.guest)) {
    if (localStorage.getItem("authToken")) {
      next("/");
      return;
    }
    next();
  } else {
    next();
  }
});

// router.beforeEach((to, from, next) => {
//   if (!userLoggedIn) {
//     next("/login")
//     return false
//   }
//   else return next();
// });

export default router;
