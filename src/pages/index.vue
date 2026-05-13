<script setup>
import { usePlayerStore } from '@/stores/playerStore'
import LeagueCard from '../components/LeagueCard.vue'

const playerStore = usePlayerStore()
</script>

<template>
  <v-container class="home-container">
    <section class="hero-section">
      <div class="hero-content">
        <p class="subtitle">Projet C141</p>

        <h1 class="text-h2 font-weight-bold mb-4">
          TopPlayers – Elite Football Stats
        </h1>

        <p class="description">
          Explore les meilleures ligues européennes, consulte les meilleurs buteurs,
          compare leurs statistiques et crée ta propre sélection de joueurs favoris.
        </p>

        <div class="hero-actions">
          <v-btn
              color="primary"
              size="large"
              prepend-icon="mdi-soccer"
              href="#ligues"
          >
            Voir les ligues
          </v-btn>

          <v-chip
              color="white"
              variant="flat"
              class="league-count-chip"
          >
            {{ playerStore.leagues.length }} ligues disponibles
          </v-chip>
        </div>
      </div>

      <div class="hero-ball">
        <v-icon icon="mdi-soccer" size="170" />
      </div>
    </section>

    <section class="stats-section">
      <v-row>
        <v-col cols="12" sm="4">
          <v-card class="stat-card pa-4 text-center">
            <v-icon icon="mdi-trophy" size="38" color="primary" />
            <h3 class="mt-2">Ligues</h3>
            <p>Les plus grands championnats européens</p>
          </v-card>
        </v-col>

        <v-col cols="12" sm="4">
          <v-card class="stat-card pa-4 text-center">
            <v-icon icon="mdi-account-star" size="38" color="primary" />
            <h3 class="mt-2">Joueurs</h3>
            <p>Top buteurs, passes décisives et matchs</p>
          </v-card>
        </v-col>

        <v-col cols="12" sm="4">
          <v-card class="stat-card pa-4 text-center">
            <v-icon icon="mdi-heart" size="38" color="primary" />
            <h3 class="mt-2">Favoris</h3>
            <p>Crée ta propre sélection de joueurs</p>
          </v-card>
        </v-col>
      </v-row>
    </section>

    <div id="ligues" class="section-title">
      <h2>Choisis une ligue</h2>
      <p>Sélectionne un championnat pour afficher ses meilleurs joueurs.</p>
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
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  padding: 56px;
  margin-bottom: 34px;
  background:
      linear-gradient(135deg, rgba(181, 44, 18, 0.9), rgba(18, 18, 18, 0.95)),
      url('/football-bg.png');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hero-section::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
      linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 720px;
}

.subtitle {
  color: #ffffff;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.description {
  max-width: 720px;
  color: #eeeeee;
  font-size: 17px;
  line-height: 1.7;
  margin-bottom: 0;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 28px;
  flex-wrap: wrap;
}

.hero-ball {
  position: relative;
  z-index: 1;
  opacity: 0.18;
  transform: rotate(-18deg);
}

.stats-section {
  margin-bottom: 38px;
}

.stat-card {
  height: 100%;
  border: 1px solid rgba(181, 44, 18, 0.25);
}

.stat-card p {
  color: #bdbdbd;
  margin-bottom: 0;
}

.section-title {
  margin-bottom: 22px;
}

.section-title h2 {
  font-size: 30px;
  font-weight: 800;
  margin-bottom: 6px;
}

.section-title p {
  color: #bdbdbd;
  margin-bottom: 0;
}

.league-grid {
  margin-top: 8px;
}

.league-count-chip {
  color: #B52C12 !important;
  font-weight: 800;
}

@media (max-width: 800px) {
  .hero-section {
    padding: 32px;
  }

  .hero-ball {
    display: none;
  }

  .hero-section h1 {
    font-size: 34px !important;
  }
}
</style>