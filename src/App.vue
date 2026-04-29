<template>
  <v-app>
    <!-- Barre du haut -->
    <v-app-bar color="primary" height="70" flat>
      <!-- Bloc gauche (logo + texte) -->
      <div class="d-flex align-center ml-4">
        <v-img
            src="/cr7-logo-png-transparent.png"
            width="45"
            height="45"
            class="mr-3"
        />

        <div class="d-flex flex-column">
      <span class="text-h6 font-weight-bold">
        Football API
      </span>
          <span class="text-caption">
        Projet C141
      </span>
        </div>
      </div>

      <v-spacer />

      <!-- Navigation -->
      <div class="mr-4">
        <v-btn to="/" variant="text">Accueil</v-btn>
        <v-btn to="/favoris" variant="text">Favoris</v-btn>
        <v-btn to="/a-propos" variant="text">À propos</v-btn>
      </div>
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
