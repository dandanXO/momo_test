import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/search', name: 'search', component: () => import('@/views/SearchView.vue') },
    { path: '/goods/:id', name: 'goods', component: () => import('@/views/GoodsView.vue') },
  ],
})

export default router
