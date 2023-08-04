import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'knight/:id?', component: () => import('pages/KnightForm.vue') },
    ],
  },


  // Error page with named view
  {
    path: '/:catchAll(.*)*',
    components: {
      default: () => import('layouts/MainLayout.vue'),
      error: () => import('pages/ErrorNotFound.vue'),
    },
  },
];

export default routes;
