<script setup>

// =====================================================
// App.vue
//
// Fichier principal de l'application.
//
// Ce fichier contient :
// - la barre de navigation
// - le menu mobile
// - le RouterView
// - le footer
// - la gestion connexion / déconnexion
//
// Toutes les pages du site s'affichent ici.
// =====================================================



// =====================================================
// IMPORTS
// =====================================================

// ref : permet de créer des variables réactives
import { ref } from 'vue'

// useRouter : permet de changer de page
import { useRouter } from 'vue-router'

// Store d'authentification
import { useAuthStore } from '@/stores/authStore'



// =====================================================
// VARIABLES
// =====================================================

// Année actuelle affichée dans le footer
const currentYear = new Date().getFullYear()


// Router utilisé pour redirections
const router = useRouter()


// Store Pinia de connexion
const authStore = useAuthStore()


// Contrôle l'ouverture du menu mobile.
//
// false = fermé
// true = ouvert
const drawer = ref(false)



// =====================================================
// LOGOUT DESKTOP
// =====================================================

// Fonction appelée quand l'utilisateur
// clique sur "Déconnexion" desktop
const logout = () => {

  // Supprime l'utilisateur du store
  // + localStorage
  authStore.logout()

  // Retour accueil
  router.push('/')
}



// =====================================================
// LOGOUT MOBILE
// =====================================================

// Même logique que logout()
// mais ferme aussi le drawer mobile
const logoutMobile = () => {

  // Ferme le menu mobile
  drawer.value = false

  // Lance logout normal
  logout()
}
</script>



<template>

  <!-- ==========================================
       V-APP

       Conteneur principal Vuetify.
       Toute l'application doit être
       dans v-app.
  ========================================== -->

  <v-app>



    <!-- ==========================================
         BARRE DE NAVIGATION
    ========================================== -->

    <v-app-bar

        color="primary"

        height="70"

        flat
    >

      <!-- ==========================================
           BOUTON MENU MOBILE
      ========================================== -->

      <!--
        d-md-none :
        visible uniquement sur mobile
      -->
      <v-app-bar-nav-icon

          class="d-md-none"

          @click="drawer = !drawer"
      />



      <!-- ==========================================
           LOGO + TITRE
      ========================================== -->

      <div class="d-flex align-center ml-2 ml-md-4">

        <!-- Logo -->
        <v-img

            src="/cr7-logo-png-transparent.png"

            width="45"

            height="45"

            class="mr-3"
        />


        <!-- Texte logo -->
        <div class="d-flex flex-column">

          <!-- Titre principal -->
          <span class="text-h6 font-weight-bold">
            Football API
          </span>

          <!-- Sous-titre -->
          <span class="text-caption">
            Projet C141
          </span>
        </div>
      </div>



      <!-- ==========================================
           ESPACE FLEXIBLE
      ========================================== -->

      <!--
        v-spacer pousse les boutons
        complètement à droite
      -->
      <v-spacer />



      <!-- ==========================================
           MENU DESKTOP
      ========================================== -->

      <!--
        d-none :
        caché par défaut

        d-md-flex :
        affiché seulement desktop/tablette
      -->
      <div class="mr-4 d-none d-md-flex align-center">


        <!-- ==========================================
             ACCUEIL
        ========================================== -->

        <v-btn
            to="/"
            variant="text"
        >
          Accueil
        </v-btn>



        <!-- ==========================================
             FAVORIS
        ========================================== -->

        <v-btn
            to="/favoris"
            variant="text"
        >
          Favoris
        </v-btn>



        <!-- ==========================================
             AJOUTER
        ========================================== -->

        <!--
          Visible uniquement
          si connecté
        -->
        <v-btn

            v-if="authStore.isLoggedIn"

            to="/ajouter"

            variant="text"
        >
          Ajouter
        </v-btn>



        <!-- ==========================================
             CONNEXION
        ========================================== -->

        <!--
          Visible uniquement
          si NON connecté
        -->
        <v-btn

            v-if="!authStore.isLoggedIn"

            to="/login"

            variant="outlined"

            class="ml-2"
        >
          Connexion
        </v-btn>



        <!-- ==========================================
             DECONNEXION
        ========================================== -->

        <!--
          v-else :

          s'affiche quand
          isLoggedIn = true
        -->
        <v-btn

            v-else

            variant="outlined"

            class="ml-2"

            @click="logout"
        >
          Déconnexion
        </v-btn>
      </div>
    </v-app-bar>



    <!-- ==========================================
         MENU MOBILE
    ========================================== -->

    <!--
      v-model="drawer"

      lie le drawer avec la variable
      drawer du script.
    -->
    <v-navigation-drawer

        v-model="drawer"

        temporary

        class="d-md-none"
    >

      <!-- Liste navigation -->
      <v-list nav>



        <!-- ==========================================
             ACCUEIL MOBILE
        ========================================== -->

        <v-list-item

            prepend-icon="mdi-home"

            title="Accueil"

            to="/"

            @click="drawer = false"
        />



        <!-- ==========================================
             FAVORIS MOBILE
        ========================================== -->

        <v-list-item

            prepend-icon="mdi-heart"

            title="Favoris"

            to="/favoris"

            @click="drawer = false"
        />



        <!-- ==========================================
             AJOUTER MOBILE
        ========================================== -->

        <!--
          Visible seulement connecté
        -->
        <v-list-item

            v-if="authStore.isLoggedIn"

            prepend-icon="mdi-plus"

            title="Ajouter"

            to="/ajouter"

            @click="drawer = false"
        />



        <!-- Ligne séparation -->
        <v-divider class="my-2" />



        <!-- ==========================================
             LOGIN MOBILE
        ========================================== -->

        <!--
          Visible seulement
          si NON connecté
        -->
        <v-list-item

            v-if="!authStore.isLoggedIn"

            prepend-icon="mdi-login"

            title="Connexion"

            to="/login"

            @click="drawer = false"
        />



        <!-- ==========================================
             LOGOUT MOBILE
        ========================================== -->

        <v-list-item

            v-else

            prepend-icon="mdi-logout"

            title="Déconnexion"

            @click="logoutMobile"
        />
      </v-list>
    </v-navigation-drawer>



    <!-- ==========================================
         CONTENU DES PAGES
    ========================================== -->

    <!--
      RouterView affiche automatiquement
      la page correspondant à l'URL.

      Exemple :
      /
      => index.vue

      /favoris
      => Favoris.vue
    -->
    <v-main>

      <RouterView />

    </v-main>



    <!-- ==========================================
         FOOTER
    ========================================== -->

    <v-footer class="text-center">

      <v-col>

        Projet C141 - Emre-Esig {{ currentYear }} -

        API


        <!-- Lien vers le site API Football -->
        <a

            href="https://dashboard.api-football.com/"

            target="_blank"

            rel="noopener noreferrer"

            class="text-primary"
        >
          api-football.com
        </a>
      </v-col>
    </v-footer>
  </v-app>
</template>