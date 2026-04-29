<template>
  <v-app>
    <!-- Barre du haut -->
    <v-app-bar color="primary" prominent>
      <v-app-bar-title>
        <v-icon icon="mdi-alien" class="mr-2" />
        Football API - Projet C141
      </v-app-bar-title>

      <!-- Navigation -->
      <v-btn to="/" variant="text">Accueil</v-btn>
      <v-btn to="/favoris" variant="text">Favoris</v-btn>
      <v-btn to="/a-propos" variant="text">À propos</v-btn>
    </v-app-bar>

    <!-- Contenu des pages -->
    <v-main>
      <RouterView />
    </v-main>

    <!-- Footer -->
    <v-footer class="text-center">
      <v-col>
        Projet C141 - Emre-Esig {{ currentYear }} -
        API
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

<script setup>
// Année actuelle (pour le footer)
const currentYear = new Date().getFullYear()

// IMPORTANT:
// On ne lance plus playerStore.init() ici,
// car cette action n'existe pas dans le store actuel.
</script>
