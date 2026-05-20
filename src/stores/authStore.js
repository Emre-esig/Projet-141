// =====================================================
// authStore.js
//
// Store Pinia utilisé pour gérer :
// - la connexion
// - la déconnexion
// - l'utilisateur connecté
//
// Ce store est utilisé dans :
// - Login.vue
// - App.vue
// - router/index.js
//
// Il permet notamment de protéger certaines pages.
// =====================================================



// =====================================================
// IMPORTS
// =====================================================

// defineStore permet de créer un store Pinia.
import { defineStore } from 'pinia'



// =====================================================
// CREATION DU STORE
// =====================================================

// "auth" = nom interne du store.
//
// useAuthStore()
// sera utilisé dans les composants Vue.
export const useAuthStore = defineStore('auth', {




    // =====================================================
    // STATE
    // =====================================================

    // state contient les données globales du store.
    state: () => ({


        // =====================================================
        // USER
        // =====================================================

        /*
          localStorage.getItem('user')

          récupère l'utilisateur sauvegardé
          dans le navigateur.

          Exemple :
          '{"email":"admin@football.ch","name":"Admin"}'
        */

        /*
          JSON.parse()

          transforme le texte JSON
          en objet JavaScript.
        */

        /*
          || null

          si aucun utilisateur n'existe,
          user devient null.
        */
        user: JSON.parse(
            localStorage.getItem('user')
        ) || null
    }),




    // =====================================================
    // GETTERS
    // =====================================================

    /*
      getters = valeurs calculées.

      Fonctionnent un peu comme computed().
    */
    getters: {


        // =====================================================
        // IS LOGGED IN
        // =====================================================

        /*
          Vérifie si un utilisateur est connecté.

          true  = connecté
          false = non connecté
        */
        isLoggedIn: (state) => state.user !== null
    },




    // =====================================================
    // ACTIONS
    // =====================================================

    /*
      actions = fonctions qui modifient le state.
    */
    actions: {


        // =====================================================
        // LOGIN
        // =====================================================

        /*
          Fonction appelée depuis Login.vue

          Paramètres :
          - email
          - password
        */
        login(email, password) {


            // =====================================================
            // VERIFICATION IDENTIFIANTS
            // =====================================================

            /*
              Ici :

              login FAKE/simple.

              On compare directement
              les identifiants.

              Pas de vraie base de données.
            */
            if (
                email === 'admin@football.ch'
                &&
                password === '1234'
            ) {


                // =====================================================
                // CREATION USER
                // =====================================================

                /*
                  this.user

                  modifie le state du store.
                */
                this.user = {

                    // Email utilisateur
                    email: email,

                    // Nom affiché
                    name: 'Admin'
                }



                // =====================================================
                // SAUVEGARDE NAVIGATEUR
                // =====================================================

                /*
                  JSON.stringify()

                  transforme l'objet JS
                  en texte JSON.
                */
                localStorage.setItem(
                    'user',
                    JSON.stringify(this.user)
                )



                // =====================================================
                // RESULTAT SUCCES
                // =====================================================

                return {

                    // Connexion OK
                    success: true,

                    // Message affiché
                    // dans snackbar
                    message: 'Connexion réussie.'
                }
            }



            // =====================================================
            // RESULTAT ERREUR
            // =====================================================

            /*
              Si email/password faux.
            */
            return {

                success: false,

                message:
                    'Email ou mot de passe incorrect.'
            }
        },




        // =====================================================
        // LOGOUT
        // =====================================================

        /*
          Déconnecte l'utilisateur.
        */
        logout() {


            // =====================================================
            // RESET USER
            // =====================================================

            /*
              Plus aucun utilisateur connecté.
            */
            this.user = null



            // =====================================================
            // SUPPRESSION LOCALSTORAGE
            // =====================================================

            /*
              Supprime la sauvegarde navigateur.
            */
            localStorage.removeItem('user')
        }
    }
})