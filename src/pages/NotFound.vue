<template>
  <v-container class="text-white">
    <h1 class="text-h3 text-center my-6">404</h1>

    <v-alert type="error" variant="tonal" class="mb-4">
      La page demandée est introuvable.
    </v-alert>

    <div class="text-center">
      <v-btn color="primary" to="/">
        Retour à l'accueil
      </v-btn>
    </div>
  </v-container>
</template>