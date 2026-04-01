<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-title>
        <v-icon icon="mdi-alien" class="mr-2" />
        TopPlayers
      </v-app-bar-title>

      <v-btn to="/" variant="text">Accueil</v-btn>
      <v-btn to="/favoris" variant="text">Favoris</v-btn>
      <v-btn to="/a-propos" variant="text">À propos</v-btn>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>

    <v-footer class="text-center">
      <v-col>
        Projet C141 — Emre-Esig {{ currentYear }} —
        API
        <a href="https://dashboard.api-football.com/" target="_blank" rel="noopener noreferrer" class="text-primary">
          api-football.com
        </a>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>