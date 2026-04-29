<script setup>
import { usePlayerStore } from '@/stores/playerStore'
import LeagueCard from '../components/LeagueCard.vue'

// Page liste: on lit les ligues depuis Pinia
const playerStore = usePlayerStore()
</script>

<template>
  <v-container class="home-container">
    <div class="hero-section">
      <p class="subtitle">Projet C141</p>

      <h1 class="text-h3 font-weight-bold mb-3">
        TopPlayers – Elite Football Stats
      </h1>

      <p class="description">
        Sélectionne une ligue pour consulter les meilleurs joueurs,
        leurs statistiques et gérer tes favoris.
      </p>
    </div>

    <v-row class="league-grid">
      <v-col
          v-for="league in playerStore.leagues"
          :key="league.id"
          cols="12"
          sm="6"
          md="4"
      >
        <LeagueCard :league="league" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  min-height: calc(100vh - 170px);
  padding-top: 42px;
  padding-bottom: 70px;
}

.hero-section {
  margin-bottom: 34px;
}

.subtitle {
  color: #ff4b3e;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.description {
  max-width: 680px;
  color: #bdbdbd;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 0;
}

.league-grid {
  margin-top: 8px;
}
</style>