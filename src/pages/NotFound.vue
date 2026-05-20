<template>

  <!-- ==========================================
       CONTENEUR PRINCIPAL
  ========================================== -->

  <!--
    text-white :

    applique une couleur blanche
    au texte.
  -->
  <v-container class="text-white">
    <!-- ==========================================
         TITRE 404
    ========================================== -->

    <!--
      text-h3 :
      grande taille de texte

      text-center :
      centre horizontalement

      my-6 :
      marge verticale
    -->
    <h1 class="text-h3 text-center my-6">

      <!-- Code erreur -->
      404

    </h1>
    <!-- ==========================================
         MESSAGE ERREUR
    ========================================== -->

    <!--
      v-alert :

      composant Vuetify
      pour afficher un message.
    -->

    <!--
      type="error"

      couleur rouge erreur.
    -->

    <!--
      variant="tonal"

      style plus léger/translucide.
    -->
    <v-alert
        type="error"
        variant="tonal"
        class="mb-4"
    >

      <!-- Message affiché -->
      La page demandée est introuvable.

    </v-alert>
    <!-- ==========================================
         BOUTON RETOUR
    ========================================== -->

    <div class="text-center">

      <!--
        to="/"

        redirection accueil
      -->
      <v-btn
          color="primary"
          to="/"
      >

        Retour à l'accueil

      </v-btn>
    </div>
  </v-container>
</template>