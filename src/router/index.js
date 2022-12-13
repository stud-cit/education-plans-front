import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import Plans from '../views/pages/Plans.vue';
import Layout from '../views/Layout';
import CreatePlan from '@/views/pages/plan/CreatePlan';
import Settings from '@/views/pages/settings/Settings';
import RestrictionEditor from '@/views/pages/settings/RestrictionEditor';
import RestrictCreate from '@/views/pages/settings/RestrictionEditor/create';
import StudyTerm from '@/views/pages/settings/StudyTerm';
import FormStudy from '@/views/pages/settings/FormStudy';
import FormOrganization from '@/views/pages/settings/FormOrganization';
import SettingUsers from '@/views/pages/settings/Users/Users';
import SelectiveDisciplines from '@/views/pages/SelectiveDisciplines/SelectiveDisciplines';
import Position from '@/views/pages/settings/Position';
import Note from '@/views/pages/settings/Note';
import ListCycle from '@/views/pages/settings/ListCycle';
import NotFoundPage from '@/views/NotFoundPage';
import Forbidden from '@/views/Forbidden';
import Unauthorized from '@/views/Unauthorized';
import PreviewPlan from '@/views/pages/plan/PreviewPlan';
import Login from '@/views/pages/LoginLayout';
import Err from '@/views/Err';
import Logs from '@/views/pages/settings/Logs';
import SubjectLanguage from '@/views/pages/settings/SubjectLanguage';
import CatalogGroup from '@/views/pages/settings/CatalogGroup';
import { ROLES } from '@/utils/constants';
import CatalogHelpers from '@/views/pages/settings/Helpers/SubjectHelpers';
import SelectiveDisciplinesCatalog from '@/views/pages/SelectiveDisciplines/SelectiveDisciplinesCatalog';
import CatalogSpecialties from '@/views/pages/SelectiveDisciplines/CatalogSpecialties';
import CatalogEducationPrograms from '@/views/pages/SelectiveDisciplines/CatalogEducationPrograms';
import CatalogEducationProgram from '@/views/pages/SelectiveDisciplines/CatalogEducationPrograms/catalog';
import CatalogSpecialty from '@/views/pages/SelectiveDisciplines/CatalogSpecialties/catalog'
import MaintenanceMode from "@/views/MaintenanceMode";
import CatalogEducationProgramPDF from "@/views/pages/plan/CatalogEducationProgramPDF";
import CatalogSpecialityPDF from "@/views/pages/plan/CatalogSpecialityPDF";

const allRoles = () => Object.values(ROLES.ID);
// const allRolesExcept = (...exceptRoles) => Object.values(ROLES.ID).filter(role => exceptRoles.indexOf(role) === -1);

Vue.use(VueRouter);
const BREADCRUMBS = {
  SETTINGS: [
    { text: 'Робота з планами', to: { name: 'ListPlans' } },
    { text: 'Налаштування', to: { name: 'Settings' } },
  ],
};

const routes = [
  {
    path: '/login',
    name: 'Login',
    meta: { guest: true },
    component: Login,
  },
  {
    path: '/err',
    name: 'err',
    meta: { guest: true },
    component: Err,
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
          accessIsAllowed: allRoles(),
          breadCrumb: [{ text: 'Робота з планами' }],
        },
      },
      {
        path: 'selective-disciplines',
        name: 'SelectiveDisciplines',
        component: SelectiveDisciplines,
        meta: {
          requiresAuth: true,
          accessIsAllowed: allRoles(),
          header: 'Вибіркові дисципліни',
          breadCrumb: [{ text: 'Вибіркові дисципліни' }],
        },
      },
      {
        path: 'selective-disciplines-catalog',
        name: 'SelectiveDisciplinesCatalog',
        component: SelectiveDisciplinesCatalog,
        meta: {
          requiresAuth: true,
          accessIsAllowed: allRoles(),
          header: 'Вибіркові дисципліни (каталог)',
          breadCrumb: [
            {
              text: 'Вибіркові дисципліни',
              to: { name: 'SelectiveDisciplines' },
            },
            { text: 'Вибіркові дисципліни (каталог)' },
          ],
        },
      },
      {
        path: 'catalog-specialties',
        component: () => import('@/views/SimpleLayout'),
        children: [
          {
            path: '',
            name: 'CatalogSpecialties',
            component: CatalogSpecialties,
            meta: {
              requiresAuth: true,
              accessIsAllowed: allRoles(),
              header: 'Вибіркові дисципліни за спеціальністю (каталог)',
              breadCrumb: [
                {
                  text: 'Вибіркові дисципліни',
                  to: { name: 'SelectiveDisciplines' },
                },
                { text: 'Каталоги вибіркових дисциплін за спеціальністю' },
              ],
            },
          },
          {
            path: ':id',
            name: 'CatalogSpecialty',
            component: CatalogSpecialty,
            meta: {
              requiresAuth: true,
              header: 'Каталог',
              accessIsAllowed: allRoles(),
              breadCrumb: [
                {
                  text: 'Вибіркові дисципліни',
                  to: { name: 'SelectiveDisciplines' },
                },
                {
                  text: 'Каталоги вибіркових дисциплін за спеціальністю',
                  to: { name: 'CatalogSpecialties' },
                },
                { text: 'Каталог' },
              ],
            },
          },
        ]
      },
      {
        path: 'catalog-education-programs',
        component: () => import('@/views/SimpleLayout'),
        children: [
          {
            path: '',
            name: 'CatalogEducationPrograms',
            component: CatalogEducationPrograms,
            meta: {
              requiresAuth: true,
              accessIsAllowed: allRoles(),
              header: 'Вибіркові дисципліни за освітньою програмою (каталог)',
              breadCrumb: [
                {
                  text: 'Вибіркові дисципліни',
                  to: { name: 'SelectiveDisciplines' },
                },
                { text: 'Каталоги вибіркових дисциплін за освітньою програмою' },
              ],
            },
          },
          {
            path: ':id',
            name: 'CatalogEducationProgram',
            component: CatalogEducationProgram,
            meta: {
              requiresAuth: true,
              header: 'Каталог',
              accessIsAllowed: allRoles(),
              breadCrumb: [
                {
                  text: 'Вибіркові дисципліни',
                  to: { name: 'SelectiveDisciplines' },
                },
                {
                  text: 'Каталоги вибіркових дисциплін за освітньою програмою',
                  to: { name: 'CatalogEducationPrograms' },
                },
                { text: 'Каталог' },
              ],
            },
          },
        ]
      },
    ],
  },
  // {
  //   path: '/plan/pdf/education-program/:id',
  //   component: Layout,
  //   children: []
  // },
  {
    path: '/plan/pdf',
    component: Layout,
    children: [
      {
        path: 'speciality/:id',
        name: 'PlanCatalogSpecialityPdf',
        component: CatalogSpecialityPDF,
        meta: {
          requiresAuth: true,
          accessIsAllowed: [
            ROLES.ID.admin,
            ROLES.ID.root,
            ROLES.ID.training_department,
            ROLES.ID.practice_department,
            ROLES.ID.educational_department_deputy,
            ROLES.ID.educational_department_chief,
          ],
          header: 'PDF Спеціальності',
          // breadCrumb: [
          //   {
          //     text: 'Робота з планами',
          //     to: { name: 'ListPlans' },
          //   },
          //   {
          //     text: 'Створення нового плану',
          //   },
          // ],
        },
      },
      {
        path: 'education-program/:id',
        name: 'PlanCatalogEducationProgramPdf',
        component: CatalogEducationProgramPDF,
        meta: {
          requiresAuth: true,
          accessIsAllowed: [
            ROLES.ID.admin,
            ROLES.ID.root,
            ROLES.ID.training_department,
            ROLES.ID.practice_department,
            ROLES.ID.educational_department_deputy,
            ROLES.ID.educational_department_chief,
          ],
          header: 'PDF Освітної програми',
          // breadCrumb: [
          //   {
          //     text: 'Робота з планами',
          //     to: { name: 'ListPlans' },
          //   },
          //   {
          //     text: 'Створення нового плану',
          //   },
          // ],
        },
      }
    ]
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
          accessIsAllowed: [
            ROLES.ID.admin,
            ROLES.ID.root,
            ROLES.ID.training_department,
            ROLES.ID.practice_department,
            ROLES.ID.educational_department_deputy,
            ROLES.ID.educational_department_chief,
          ],
          header: 'Створення нового плану',
          breadCrumb: [
            {
              text: 'Робота з планами',
              to: { name: 'ListPlans' },
            },
            {
              text: 'Створення нового плану',
            },
          ],
        },
      },
      {
        path: 'edit/:id/:title',
        name: 'EditPlan',
        component: CreatePlan,
        meta: {
          requiresAuth: true,
          accessIsAllowed: allRoles(),
          header: 'Редагування плану',
          breadCrumb() {
            const paramToPageB = this.$route.params.title;
            return [{ text: 'Робота з планами', to: { name: 'ListPlans' } }, { text: paramToPageB }];
          },
        },
      },
      {
        path: 'preview/:id/:title',
        name: 'PreviewPlan',
        component: PreviewPlan,
        meta: {
          requiresAuth: true,
          accessIsAllowed: allRoles(),
          header: 'Попередній перегляд плану',
          breadCrumb() {
            const params = this.$route.params;
            return [
              { text: 'Робота з планами', to: { name: 'ListPlans' } },
              { text: params.title, to: { name: 'EditPlan', params } },
              { text: 'Попередній перегляд' },
            ];
          },
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
          accessIsAllowed: [ROLES.ID.admin, ROLES.ID.root, ROLES.ID.faculty_institute],
          header: 'Налаштування',
          breadCrumb: [{ text: 'Робота з планами', to: { name: 'ListPlans' } }, { text: 'Налаштування' }],
        },
      },
      {
        path: 'users',
        name: 'SettingUsers',
        component: SettingUsers,
        meta: {
          requiresAuth: true,
          accessIsAllowed: [ROLES.ID.admin, ROLES.ID.root, ROLES.ID.faculty_institute],
          header: 'Налаштування користувачів',
          breadCrumb: [...BREADCRUMBS.SETTINGS, { text: 'Налаштування користувачів' }],
        },
      },
      {
        path: 'form-study',
        name: 'FormStudy',
        component: FormStudy,
        meta: {
          requiresAuth: true,
          accessIsAllowed: [ROLES.ID.admin, ROLES.ID.root],
          header: 'Форма навчання',
          breadCrumb: [...BREADCRUMBS.SETTINGS, { text: 'Форма навчання' }],
        },
      },
      {
        path: 'form-organizations',
        name: 'FormOrganization',
        component: FormOrganization,
        meta: {
          requiresAuth: true,
          accessIsAllowed: [ROLES.ID.admin, ROLES.ID.root],
          header: 'Форма організації навчання',
          breadCrumb: [...BREADCRUMBS.SETTINGS, { text: 'Форма організації навчання' }],
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
              accessIsAllowed: [ROLES.ID.admin, ROLES.ID.root],
              header: 'Редактор обмежень',
              breadCrumb: [...BREADCRUMBS.SETTINGS, { text: 'Редактор обмежень' }],
            },
          },
          {
            path: 'create',
            name: 'RestrictCreate',
            component: RestrictCreate,
            meta: {
              requiresAuth: true,
              accessIsAllowed: [ROLES.ID.admin, ROLES.ID.root],
              header: 'Додавання налаштувань',
              breadCrumb: [
                ...BREADCRUMBS.SETTINGS,
                {
                  text: 'Редактор обмежень',
                  to: { name: 'RestrictionEditor' },
                },
                { text: 'Додавання налаштувань' },
              ],
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
          accessIsAllowed: [ROLES.ID.admin, ROLES.ID.root],
          header: 'Термін навчання',
          breadCrumb: [...BREADCRUMBS.SETTINGS, { text: 'Термін навчання' }],
        },
      },
      {
        path: 'subject-languages',
        name: 'SubjectLanguage',
        component: SubjectLanguage,
        meta: {
          requiresAuth: true,
          accessIsAllowed: [ROLES.ID.admin, ROLES.ID.root],
          header: 'Мова викладання',
          breadCrumb: [...BREADCRUMBS.SETTINGS, { text: 'Мова викладання' }],
        },
      },
      {
        path: 'catalog-groups',
        name: 'CatalogGroup',
        component: CatalogGroup,
        meta: {
          requiresAuth: true,
          accessIsAllowed: [ROLES.ID.admin, ROLES.ID.root],
          header: 'Група дисциплін',
          breadCrumb: [...BREADCRUMBS.SETTINGS, { text: 'Група дисциплін' }],
        },
      },
      {
        path: 'position',
        name: 'Position',
        component: Position,
        meta: {
          requiresAuth: true,
          accessIsAllowed: [ROLES.ID.admin, ROLES.ID.root],
          header: 'Посади',
          breadCrumb: [...BREADCRUMBS.SETTINGS, { text: 'Посади' }],
        },
      },
      {
        path: 'notes',
        name: 'Note',
        component: Note,
        meta: {
          requiresAuth: true,
          accessIsAllowed: [ROLES.ID.admin, ROLES.ID.root],
          header: 'Примітки',
          breadCrumb: [...BREADCRUMBS.SETTINGS, { text: 'Примітки' }],
        },
      },
      {
        path: 'list-cycles',
        name: 'ListCycle',
        component: ListCycle,
        meta: {
          requiresAuth: true,
          accessIsAllowed: [ROLES.ID.admin, ROLES.ID.root],
          header: 'Цикли',
          breadCrumb: [...BREADCRUMBS.SETTINGS, { text: 'Цикли' }],
        },
      },
      {
        path: 'catalog-helpers',
        name: 'CatalogHelpers',
        component: CatalogHelpers,
        meta: {
          requiresAuth: true,
          accessIsAllowed: [ROLES.ID.admin, ROLES.ID.root],
          header: 'Підказки для каталогів',
          breadCrumb: [...BREADCRUMBS.SETTINGS, { text: 'Підказки для каталогів' }],
        },
      },
      {
        path: 'logs',
        name: 'Logs',
        component: Logs,
        meta: {
          requiresAuth: true,
          accessIsAllowed: [ROLES.ID.admin, ROLES.ID.root],
          header: 'Активності',
          breadCrumb: [...BREADCRUMBS.SETTINGS, { text: 'Активності' }],
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
    meta: { guest: true },
  },
  {
    path: '/503',
    name: 'MaintenanceMode',
    component: MaintenanceMode,
    meta: { guest: true },
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: Forbidden,
    meta: { guest: true },
  },
  {
    path: '/401',
    name: 'Unauthorized',
    component: Unauthorized,
    meta: { guest: true },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

const getUserRoleId = async () => {
  let userRoleId = store.getters['auth/user'];

  // if (userRoleId === null) {
  await store.dispatch('auth/getUserData');
  userRoleId = store.getters['auth/user'];
  // }
  return userRoleId.role_id;
};

// this method on to get cabinet token
router.beforeEach(async (to, from, next) => {
  const guest = to.matched.some((record) => record.meta.guest);

  if (!guest) {
    if (localStorage.getItem('cabinetToken')) {
      await getUserRoleId();
      next();
    } else if ('key' in to.query && to.query.key != null) {
      localStorage.setItem('cabinetToken', to.query.key);
      await getUserRoleId();
      next();
    } else {
      window.location.replace(
        process.env.VUE_APP_CABINET_APP_URL +
          process.env.VUE_APP_CABINET_APP_SERVICE +
          process.env.VUE_APP_CABINET_APP_TOKEN,
      );
    }
  }

  next();
});

// this method to check user and role_id
router.beforeEach(async (to, from, next) => {
  const guest = to.matched.some((record) => record.meta.guest);

  if (!guest) {
    const accessIsAllowed = to.meta.accessIsAllowed;
    const userRoleId = store.getters['auth/user'].role_id;

    if (accessIsAllowed !== undefined) {
      if (accessIsAllowed.includes(userRoleId)) {
        next();
      } else {
        next({ name: 'Forbidden' });
      }
    } else {
      if (!guest) {
        next({ name: 'Forbidden' });
      }
      next();
    }
  }
  next();
});

export default router;
