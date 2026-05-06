import { createRouter, createWebHistory } from 'vue-router'
import Index from '../pages/index.vue'
import LeagueDetail from '../pages/LeagueDetail.vue'
import Favoris from '../pages/Favoris.vue'
import APropos from '../pages/APropos.vue'
import NotFound from '../pages/NotFound.vue'
import Login from '../pages/Login.vue'
import AjouterJoueur from '../pages/AjouterJoueur.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Index
    },
    {
      path: '/league/:id',
      name: 'league-detail',
      component: LeagueDetail
    },
    {
      path: '/favoris',
      name: 'favoris',
      component: Favoris,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/ajouter',
      name: 'ajouter',
      component: AjouterJoueur,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/a-propos',
      name: 'a-propos',
      component: APropos
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound
    }
  ]
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath
      }
    }
  }
})

export default router