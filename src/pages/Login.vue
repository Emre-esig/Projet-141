<script setup>
// =====================================================
// Login.vue
//
// Cette page permet à l'utilisateur :
// - de saisir son email
// - de saisir son mot de passe
// - de se connecter
//
// Si la connexion fonctionne :
// - les informations utilisateur sont stockées
// - l'utilisateur est redirigé
//
// Cette page utilise :
// - Vue
// - Vue Router
// - Pinia
// - Vuetify
// =====================================================



// =====================================================
// IMPORTS
// =====================================================

// ref : permet de créer des variables réactives simples
import { ref } from 'vue'

// useRouter : permet de changer de page
// useRoute : permet de lire l'URL actuelle
import { useRouter, useRoute } from 'vue-router'

// Store d'authentification
import { useAuthStore } from '@/stores/authStore'



// =====================================================
// ROUTER
// =====================================================

// Router utilisé pour rediriger l'utilisateur
const router = useRouter()

// Route actuelle utilisée pour lire le paramètre redirect
const route = useRoute()



// =====================================================
// STORE AUTH
// =====================================================

// Store Pinia de connexion
const authStore = useAuthStore()



// =====================================================
// VARIABLES REACTIVES
// =====================================================

// Référence du formulaire Vuetify.
// Permet de lancer :
//
// form.value.validate()
const form = ref(null)


// Email tapé dans le champ
const email = ref('')


// Mot de passe tapé dans le champ
const password = ref('')


// Contrôle l'affichage de la snackbar
//
// false = cachée
// true = affichée
const snackbar = ref(false)


// Message affiché dans la snackbar
const message = ref('')


// Couleur de la snackbar
//
// success = vert
// error = rouge
const color = ref('success')



// =====================================================
// REGLES VALIDATION
// =====================================================

// Objet contenant les règles utilisées par Vuetify
const rules = {

  // Vérifie que le champ n'est pas vide
  required: value => !!value || 'Champ obligatoire'
}



// =====================================================
// FONCTION LOGIN
// =====================================================

// Fonction appelée quand l'utilisateur clique
// sur "Se connecter"
const login = async () => {

  // Lance la validation du formulaire Vuetify
  const resultValidation = await form.value.validate()


  // Si le formulaire est invalide
  // on arrête immédiatement
  if (!resultValidation.valid) {
    return
  }


  // Appelle la fonction login du store Pinia
  const result = authStore.login(
      email.value,
      password.value
  )


  // Message retourné par le store
  message.value = result.message


  // Couleur selon succès ou erreur
  color.value = result.success
      ? 'success'
      : 'error'


  // Affiche la notification
  snackbar.value = true


  // Si la connexion fonctionne
  if (result.success) {

    // Si l'utilisateur venait d'une page protégée,
    // on retourne sur cette page.
    //
    // Sinon :
    // retour accueil "/"
    const redirect =
        route.query.redirect || '/'


    // Redirection
    router.push(redirect)
  }
}
</script>



<template>

  <!-- ==========================================
       CONTENEUR PRINCIPAL
  ========================================== -->

  <v-container class="login-container">


    <!-- ==========================================
         CARTE CONNEXION
    ========================================== -->

    <v-card
        class="pa-6 mx-auto"
        max-width="500"
    >

      <!-- Titre -->
      <h1 class="text-h4 text-center mb-6">
        Connexion
      </h1>



      <!-- ==========================================
           FORMULAIRE
      ========================================== -->

      <v-form
          ref="form"
          @submit.prevent="login"
      >

        <!-- ==========================================
             EMAIL
        ========================================== -->

        <v-text-field
            v-model="email"

            label="Email"

            type="email"

            prepend-inner-icon="mdi-email"

            variant="outlined"

            :rules="[rules.required]"

            class="mb-3"
        />



        <!-- ==========================================
             MOT DE PASSE
        ========================================== -->

        <v-text-field
            v-model="password"

            label="Mot de passe"

            type="password"

            prepend-inner-icon="mdi-lock"

            variant="outlined"

            :rules="[rules.required]"

            class="mb-4"
        />



        <!-- ==========================================
             BOUTON CONNEXION
        ========================================== -->

        <v-btn
            type="submit"

            color="primary"

            block

            size="large"
        >
          Se connecter
        </v-btn>
      </v-form>



      <!-- ==========================================
           INFORMATIONS TEST
      ========================================== -->

      <v-alert
          type="info"
          variant="tonal"
          class="mt-6"
      >

        <!-- Compte utilisé pour tester -->
        Email : admin@football.ch

        <br>

        Mot de passe : 1234
      </v-alert>
    </v-card>



    <!-- ==========================================
         SNACKBAR
    ========================================== -->

    <v-snackbar
        v-model="snackbar"
        :color="color"
    >
      {{ message }}
    </v-snackbar>
  </v-container>
</template>



<style scoped>

/* ==========================================
   CONTENEUR PAGE
========================================== */

/*
  calc(100vh - 170px)

  100vh :
  hauteur totale écran

  170px :
  espace réservé header + footer
*/
.login-container {

  min-height: calc(100vh - 170px);

  display: flex;

  /* Centre verticalement */
  align-items: center;
}
</style>