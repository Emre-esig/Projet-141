// =====================================================
// axios.js
//
// Ce fichier configure Axios.
//
// Axios est une librairie utilisée pour :
// - envoyer des requêtes HTTP
// - appeler une API
// - récupérer des données
//
// Ici Axios est utilisé pour communiquer
// avec l'API Football.
// =====================================================


// =====================================================
// IMPORT AXIOS
// =====================================================

// Import de la librairie Axios.
import axios from 'axios'

// =====================================================
// VARIABLES ENVIRONNEMENT
// =====================================================

/*
  import.meta.env

  permet de lire les variables
  du fichier .env
*/


// =====================================================
// URL API
// =====================================================

/*
  VITE_API_URL

  vient du fichier .env

  Exemple :
  https://v3.football.api-sports.io
*/

/*
  || 'https://v3.football.api-sports.io'

  fallback :

  si VITE_API_URL n'existe pas,
  cette URL sera utilisée.
*/
const API_BASE_URL =
    import.meta.env.VITE_API_URL
    ||
    'https://v3.football.api-sports.io'

// =====================================================
// CLE API
// =====================================================

/*
  Clé API privée utilisée
  pour accéder à API-Football.
*/
const API_KEY =
    import.meta.env.VITE_API_KEY

// =====================================================
// CREATION INSTANCE AXIOS
// =====================================================

/*
  axios.create()

  crée une instance Axios personnalisée.

  Cette instance contient déjà :
  - l'URL API
  - les headers
*/
const api = axios.create({

    // =====================================================
    // BASE URL
    // =====================================================

    /*
      Toutes les requêtes commenceront par :

      https://v3.football.api-sports.io
    */
    baseURL: API_BASE_URL,


    // =====================================================
    // HEADERS HTTP
    // =====================================================

    headers: {


        // =====================================================
        // TYPE DONNEES
        // =====================================================

        /*
          Les données envoyées
          sont au format JSON.
        */
        'Content-Type': 'application/json',

        // =====================================================
        // CLE API FOOTBALL
        // =====================================================

        /*
          Header obligatoire pour API-Football.
        */

        /*
          || ''

          évite erreur si clé absente.
        */
        'x-apisports-key': API_KEY || ''
    }
})

// =====================================================
// EXPORT
// =====================================================

/*
  Permet d'utiliser :

  import api from '@/plugins/axios'

  dans tout le projet.
*/
export default api