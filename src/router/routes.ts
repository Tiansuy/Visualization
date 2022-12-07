import { RouteRecordRaw } from 'vue-router';
const routes: Array<RouteRecordRaw> = [
    {
      path: '/',
      component: () => import('@/pages/index.vue'),
      children: [
        {path: '', component: () => import('@/pages/Dashboard.vue')},
        {path: '/Dashboard2', component: () => import('@/pages/Dashboard2.vue')},
        {path: '/ChineseColor', component: () => import('@/pages/demos/ChineseColor/ChineseColor.vue')},
        {path: '/Nobel', component: () => import('@/pages/demos/Nobel/Nobel.vue')},
        {path: '/DataExplorer', component: () => import('@/pages/demos/DataExplorer/DataExplorer.vue')},
      ]
    },
  
    // Always leave this as last one,
    // but you can also remove it
    {
      path: '/:catchAll(.*)*',
      component: () => import('@/pages/error.vue')
    },
]
  
export default routes
  