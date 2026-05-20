// =====================================================
// vuetify.js
//
// Ce fichier configure Vuetify.
//
// Il définit :
// - le thème dark
// - les couleurs globales
// - les styles par défaut
// - les composants Vuetify
//
// Toute l'interface du projet utilise
// cette configuration.
// =====================================================

// =====================================================
// IMPORTS
// =====================================================

// =====================================================
// MATERIAL DESIGN ICONS
// =====================================================

/*
  Bibliothèque d'icônes utilisée dans le projet.

  Exemple :
  mdi-heart
  mdi-home
  mdi-soccer
*/
import '@mdi/font/css/materialdesignicons.css'

// =====================================================
// STYLES VUETIFY
// =====================================================

/*
  Charge les styles CSS internes
  de Vuetify.
*/
import 'vuetify/styles'
// =====================================================
// CREATE VUETIFY
// =====================================================

/*
  Fonction principale permettant
  de créer la configuration Vuetify.
*/
import { createVuetify } from 'vuetify'

// =====================================================
// EXPORT CONFIGURATION
// =====================================================

export default createVuetify({
  // =====================================================
  // THEME
  // =====================================================

  theme: {
    // =====================================================
    // THEME PAR DEFAUT
    // =====================================================

    /*
      dark = thème sombre
    */
    defaultTheme: 'dark',
    // =====================================================
    // THEMES DISPONIBLES
    // =====================================================

    themes: {
      // =====================================================
      // THEME DARK
      // =====================================================

      dark: {
        // Active le mode sombre
        dark: true,

        // =====================================================
        // COULEURS GLOBALES
        // =====================================================

        /*
          Ces couleurs peuvent être utilisées
          partout dans Vuetify.

          Exemple :
          color="primary"
          color="success"
        */
        colors: {


          // Couleur fond principal site
          background: '#121212',


          // Couleur cartes et surfaces
          surface: '#1E1E1E',


          // Couleur principale du projet
          // rouge football
          primary: '#B52C12',


          // Couleur secondaire
          secondary: '#FFFFFF',


          // Couleur accent
          accent: '#000000',


          // Couleur erreurs
          error: '#E63946',


          // Couleur informations
          info: '#44CFCB',


          // Couleur succès
          success: '#97CE4C',


          // Couleur avertissements
          warning: '#FFA724'
        }
      }
    }
  },

  // =====================================================
  // DEFAULTS
  // =====================================================

  /*
    defaults permet de définir
    les styles automatiques
    des composants Vuetify.
  */
  defaults: {
    // =====================================================
    // VCARD
    // =====================================================

    VCard: {

      // Coins arrondis
      rounded: 'lg',

      // Ombre carte
      elevation: 3
    },

    // =====================================================
    // VBUTTON
    // =====================================================

    VBtn: {
      // Boutons arrondis
      rounded: 'lg'
    },

    // =====================================================
    // VTEXTFIELD
    // =====================================================

    VTextField: {
      // Taille confortable champs texte
      density: 'comfortable'
    },

    // =====================================================
    // VSELECT
    // =====================================================

    VSelect: {
      // Taille confortable menus select
      density: 'comfortable'
    }
  }
})