import Vue from "vue";
import VueRouter from "vue-router";
import Plans from "../views/pages/Plans.vue";
import Layout from "../views/Layout";
import CreatePlan from "@/views/pages/plan/CreatePlan";
import Settings from "@/views/pages/settings/Settings";
import RestrictionEditor from "@/views/pages/settings/RestrictionEditor";
import RestrictCreate from "@/views/pages/settings/RestrictionEditor/create";
import RestrictEdit from "@/views/pages/settings/RestrictionEditor/edit";
import StudyTerm from "@/views/pages/settings/StudyTerm";
import FormStudy from "@/views/pages/settings/FormStudy";
import FormOrganization from "@/views/pages/settings/FormOrganization";
import SettingUsers from "@/views/pages/settings/Users/Users";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "",
        name: "ListPlans",
        component: Plans,
        meta: {
          header: "Робота з планами",
        },
      },
    ],
  },
  {
    path: "/plan",
    component: Layout,
    children: [
      {
        path: "create",
        name: "CreatePlan",
        component: CreatePlan,
        meta: {
          header: "Створення нового плану",
        },
      },
    ],
  },
  {
    path: "/settings",
    component: Layout,
    children: [
      {
        path: "",
        name: "Settings",
        component: Settings,
        meta: {
          header: "Налаштування",
        },
      },
      {
        path: "users",
        name: "SettingUsers",
        component: SettingUsers,
        meta: {
          header: "Налаштування користувачів",
        },
      },
      {
        path: "form-study",
        name: "FormStudy",
        component: FormStudy,
        meta: { header: "Форма навчання" },
      },
      {
        path: 'form-organizations',
        name: 'FormOrganization',
        component: FormOrganization,
        meta: { header: "Форма організації навчання" },
      },
      {
        path: "restriction-editor",
        component: () => import("@/views/SimpleLayout"),
        children: [
          {
            path: '',
            name: "RestrictionEditor",
            component: RestrictionEditor,
            meta: {
              header: "Редактор обмежень",
            },
          },
          {
            path: "create",
            name: "RestrictCreate",
            component: RestrictCreate,
            meta: {
              header: "Додавання налаштувань",
            },
          },
          {
            path: ':id',
            params: ['id'],
            name: 'RestrictEdit',
            meta: { header: 'Редагування' },
            component: RestrictEdit,
            beforeEnter: (to, from, next) => {
              if (/^[0-9]+$/.test(to.params.id)) {
                next();
              } else {
                next("/");
              }
            },
          },
        ],
      },

      {
        path: "study-term",
        name: "StudyTerm",
        component: StudyTerm,
        meta: { header: "Термін навчання" },
      },
    ],
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
