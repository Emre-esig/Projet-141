// =====================================================
// plugins/index.js
//
// Ce fichier centralise l'installation
// des plugins principaux de l'application.
//
// Ici on installe :
// - Vuetify
// - Vue Router
// - Pinia
//
// Ce fichier est appelé dans main.js.
// =====================================================

// =====================================================
// IMPORTS
// =====================================================

// =====================================================
// VUETIFY
// =====================================================

/*
  Configuration Vuetify personnalisée.

  Contient :
  - thème dark
  - couleurs
  - styles par défaut
*/
import vuetify from './vuetify'

// =====================================================
// PINIA
// =====================================================

/*
  Store global de l'application.

  Permet de partager :
  - joueurs
  - favoris
  - utilisateur connecté
  - etc.
*/
import pinia from '@/stores'

// =====================================================
// ROUTER
// =====================================================

/*
  Système de navigation Vue Router.

  Gère :
  - les pages
  - les URLs
  - les redirections
  - les routes protégées
*/
import router from '@/router'

// =====================================================
// REGISTER PLUGINS
// =====================================================

/*
  Fonction appelée dans main.js

  Paramètre :
  app = application Vue créée par createApp()
*/
export function registerPlugins (app) {

  /*
    app.use(...)

    installe un plugin dans Vue.
  */

  app

      // =====================================================
      // VUETIFY
      // =====================================================

      /*
        Active tous les composants Vuetify :

        - v-btn
        - v-card
        - v-container
        - etc.
      */
      .use(vuetify)

      // =====================================================
      // ROUTER
      // =====================================================

      /*
        Active Vue Router.

        Permet :
        - RouterView
        - router.push()
        - useRoute()
        - useRouter()
      */
      .use(router)

      // =====================================================
      // PINIA
      // =====================================================

      /*
        Active Pinia.

        Permet :
        - defineStore()
        - usePlayerStore()
        - useAuthStore()
      */
      .use(pinia)
}