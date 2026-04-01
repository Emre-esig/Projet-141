import { createRouter, createWebHistory } from 'vue-router'
import Index from '../pages/index.vue'
import LeagueDetail from '../pages/LeagueDetail.vue'
import Favoris from '../pages/Favoris.vue'
import APropos from '../pages/APropos.vue'
import NotFound from '../pages/NotFound.vue'

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
      component: Favoris
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

export default router