// ==============================
// IMPORT DES PLUGINS
// ==============================

/**
 * VueRouter
 *
 * Plugin permettant le file-based routing.
 *
 * Il peut générer automatiquement des routes
 * à partir des fichiers du dossier pages.
 */
import VueRouter from 'unplugin-vue-router/vite'


/**
 * Components
 *
 * Plugin permettant d'importer automatiquement
 * certains composants Vue.
 *
 * Évite parfois les imports manuels.
 */
import Components from 'unplugin-vue-components/vite'


/**
 * Plugin principal Vue.js pour Vite.
 */
import Vue from '@vitejs/plugin-vue'


/**
 * Plugin Vuetify pour Vite.
 *
 * transformAssetUrls :
 * aide Vuetify à gérer correctement
 * les images/assets dans les templates.
 */
import Vuetify, {
  transformAssetUrls
} from 'vite-plugin-vuetify'


/**
 * Plugin pour charger automatiquement
 * des polices Google Fonts.
 */
import ViteFonts from 'unplugin-fonts/vite'



// ==============================
// UTILITAIRES VITE
// ==============================

/**
 * defineConfig
 *
 * Fonction officielle pour configurer Vite.
 */
import { defineConfig } from 'vite'


/**
 * fileURLToPath + URL
 *
 * Utilisés pour créer l'alias :
 * @ => /src
 */
import {
  fileURLToPath,
  URL
} from 'node:url'



// ==============================
// CONFIGURATION VITE
// ==============================

// https://vitejs.dev/config/
export default defineConfig({


  // ==============================
  // BASE URL
  // ==============================

  /**
   * base
   *
   * URL de base du projet.
   *
   * process.env.BASE_URL :
   * peut être défini automatiquement
   * selon l'environnement.
   *
   * Sinon :
   * '/'
   */
  base: process.env.BASE_URL || '/',



  // ==============================
  // PLUGINS
  // ==============================

  plugins: [

    /**
     * File-based routing.
     *
     * IMPORTANT :
     * doit être avant Vue().
     */
    VueRouter(),



    /**
     * Plugin Vue principal.
     */
    Vue({

      /**
       * transformAssetUrls
       *
       * Corrige la gestion des images/assets
       * dans Vuetify.
       */
      template: {
        transformAssetUrls
      }
    }),



    /**
     * Plugin Vuetify.
     *
     * Permet à Vite de comprendre
     * les composants Vuetify.
     */
    Vuetify(),



    /**
     * Auto import composants.
     */
    Components(),



    /**
     * Chargement automatique
     * des Google Fonts.
     */
    ViteFonts({

      google: {

        families: [

          {
            // Nom de la police
            name: 'Roboto',

            // Poids disponibles
            styles:
                'wght@100;300;400;500;700;900',
          }
        ],
      },
    }),
  ],



  // ==============================
  // DEFINE
  // ==============================

  /**
   * Définit process.env vide.
   *
   * Évite certaines erreurs
   * de compatibilité.
   */
  define: {
    'process.env': {}
  },



  // ==============================
  // RESOLVE
  // ==============================

  resolve: {

    // ==============================
    // ALIAS
    // ==============================

    alias: {

      /**
       * Alias :
       * @ => dossier src
       *
       * Exemple :
       *
       * import x from '@/stores/playerStore'
       *
       * au lieu de :
       *
       * ../../../stores/playerStore
       */
      '@': fileURLToPath(
          new URL('./src', import.meta.url)
      )
    },



    // ==============================
    // EXTENSIONS
    // ==============================

    /**
     * Extensions reconnues automatiquement.
     *
     * Permet parfois d'éviter
     * d'écrire :
     *
     * import x from './test.vue'
     *
     * et juste :
     *
     * import x from './test'
     */
    extensions: [

      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },



  // ==============================
  // SERVEUR DEV
  // ==============================

  server: {

    /**
     * Port utilisé par Vite.
     *
     * Projet accessible via :
     * http://localhost:3000
     */
    port: 3000,
  },



  // ==============================
  // CSS / SASS
  // ==============================

  css: {

    preprocessorOptions: {

      sass: {

        /**
         * Utilise le compilateur SASS moderne.
         */
        api: 'modern-compiler',
      },
    },
  },
})