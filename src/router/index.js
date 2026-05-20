// =====================================================
// router/index.js
//
// Ce fichier gère tout le système de navigation
// de l'application.
//
// Il contient :
// - les routes/pages
// - les URLs
// - la protection des pages privées
// - les redirections
//
// Vue Router permet de transformer
// une SPA (Single Page Application)
// en véritable site navigable.
// =====================================================




// =====================================================
// IMPORTS
// =====================================================

// createRouter : crée le router principal
// createWebHistory : utilise les vraies URLs
import {
  createRouter,
  createWebHistory
} from 'vue-router'



// =====================================================
// IMPORT DES PAGES
// =====================================================

// Page accueil
import Index from '../pages/index.vue'

// Page détail ligue
import LeagueDetail from '../pages/LeagueDetail.vue'

// Page favoris
import Favoris from '../pages/Favoris.vue'

// Page 404
import NotFound from '../pages/NotFound.vue'

// Page connexion
import Login from '../pages/Login.vue'

// Page ajout joueur
import AjouterJoueur from '../pages/AjouterJoueur.vue'



// =====================================================
// STORE AUTH
// =====================================================

// Store Pinia utilisé pour vérifier
// si l'utilisateur est connecté.
import { useAuthStore } from '@/stores/authStore'





// =====================================================
// CREATION ROUTER
// =====================================================

const router = createRouter({



  // =====================================================
  // HISTORY
  // =====================================================

  /*
    createWebHistory()

    permet d'utiliser :

    /favoris
    /league/39

    au lieu de :

    /#/favoris
  */
  history: createWebHistory(),




  // =====================================================
  // ROUTES
  // =====================================================

  /*
    Tableau contenant toutes les pages
    du site.
  */
  routes: [



    // =====================================================
    // ACCUEIL
    // =====================================================

    {
      // URL
      path: '/',

      // Nom interne route
      name: 'home',

      // Composant affiché
      component: Index
    },




    // =====================================================
    // DETAIL LIGUE
    // =====================================================

    {
      /*
        :id = paramètre dynamique

        Exemple :
        /league/39

        route.params.id = 39
      */
      path: '/league/:id',

      name: 'league-detail',

      component: LeagueDetail
    },




    // =====================================================
    // FAVORIS
    // =====================================================

    {
      path: '/favoris',

      name: 'favoris',

      component: Favoris,



      // =====================================================
      // META
      // =====================================================

      /*
        meta = informations supplémentaires
        liées à la route.
      */
      meta: {

        /*
          Cette page nécessite
          une connexion.
        */
        requiresAuth: true
      }
    },




    // =====================================================
    // AJOUTER JOUEUR
    // =====================================================

    {
      path: '/ajouter',

      name: 'ajouter',

      component: AjouterJoueur,

      meta: {

        // Page protégée
        requiresAuth: true
      }
    },




    // =====================================================
    // LOGIN
    // =====================================================

    {
      path: '/login',

      name: 'login',

      component: Login
    },




    // =====================================================
    // PAGE 404
    // =====================================================

    {
      /*
        Attrape toutes les routes inconnues.

        Exemple :
        /abc
        /test
        /truc

        => NotFound.vue
      */
      path: '/:pathMatch(.*)*',

      name: 'not-found',

      component: NotFound
    }
  ]
})






// =====================================================
// NAVIGATION GUARD
// =====================================================

/*
  beforeEach()

  fonction exécutée AVANT
  chaque changement de page.
*/
router.beforeEach((to) => {



  // =====================================================
  // STORE AUTH
  // =====================================================

  const authStore = useAuthStore()



  // =====================================================
  // PROTECTION ROUTES
  // =====================================================

  /*
    Si :
    - la page demande connexion
    - ET utilisateur non connecté
  */
  if (
      to.meta.requiresAuth
      &&
      !authStore.isLoggedIn
  ) {


    // =====================================================
    // REDIRECTION LOGIN
    // =====================================================

    /*
      Redirection vers login.

      query.redirect permet ensuite
      de revenir automatiquement
      sur la page demandée.
    */
    return {

      // Route login
      name: 'login',

      query: {

        /*
          Exemple :

          utilisateur veut :
          /favoris

          redirect = "/favoris"
        */
        redirect: to.fullPath
      }
    }
  }
})

// =====================================================
// EXPORT ROUTER
// =====================================================

// Rend le router disponible
// dans toute l'application.
export default router