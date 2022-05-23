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

Vue.use(VueRouter);
const BREADCRUMBS = {
  SETTINGS: [
    { text: 'Робота з планами', to: { name: 'ListPlans' } },
    { text: 'Налаштування', to: { name: 'Settings'} },
  ]
}

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'ListPlans',
        component: Plans,
        meta: {
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
          header: 'Вибіркові дисципліни',
          breadCrumb: [
            ...BREADCRUMBS.SETTINGS,
            { text: 'Вибіркові дисципліни' }
          ]
        },
      },
    ],
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
