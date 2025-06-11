import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      props: true,
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatView.vue'),
      props: true,
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/FAQ.vue'),
      props: true,
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
