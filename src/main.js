// =====================================================
// main.js
//
// Point d'entrée principal de l'application.
//
// Ce fichier est le PREMIER exécuté
// quand le site démarre.
//
// Il sert à :
// - créer l'application Vue
// - charger les plugins
// - afficher App.vue dans index.html
// =====================================================


// =====================================================
// IMPORTS
// =====================================================

// registerPlugins()
// fonction qui installe :
// - Vuetify
// - Vue Router
// - Pinia
//
// Cette fonction vient de :
// src/plugins/index.js
import { registerPlugins } from '@/plugins'

// =====================================================
// APP PRINCIPALE
// =====================================================

// App.vue = composant racine principal.
//
// Toute l'application est affichée
// à l'intérieur de App.vue.
import App from './App.vue'

// =====================================================
// CREATE APP
// =====================================================

// createApp()
// crée l'application Vue.
import { createApp } from 'vue'

// =====================================================
// CREATION APPLICATION
// =====================================================

/*
  createApp(App)

  crée une application Vue
  basée sur App.vue
*/
const app = createApp(App)


// =====================================================
// INSTALLATION PLUGINS
// =====================================================

/*
  registerPlugins(app)

  installe :
  - Vuetify
  - Router
  - Pinia

  dans l'application Vue.
*/
registerPlugins(app)

// =====================================================
// MONTAGE APPLICATION
// =====================================================

/*
  mount('#app')

  affiche l'application Vue
  dans :

  <div id="app"></div>

  du fichier index.html
*/
app.mount('#app')