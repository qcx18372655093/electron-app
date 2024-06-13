
import { createRouter, createWebHashHistory  } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import(/* webpackChunkName: "index" */ '../views/Main/main.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          title: '功能配置',
          permiss: '0',
        },
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard/dashBoard.vue'),
      },
       {
        path: '/logicflow',
        name: 'logicflow',
        meta: {
          title: '流程图',
          permiss: '1',
        },
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/logicflow/index.vue'),
      },
    ],
  },
];
const router = createRouter({
  history:createWebHashHistory(),
  routes,
});

export default router;