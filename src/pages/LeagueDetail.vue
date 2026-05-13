<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()
const authStore = useAuthStore()

const leagueId = computed(() => Number(route.params.id))
const league = computed(() => playerStore.getLeagueById(leagueId.value))

const searchPlayer = ref('')
const searchTeam = ref('')
const sortOption = ref('goalsDesc')

const allPlayers = computed(() => {
  const apiPlayers = playerStore.players
  const customPlayers = playerStore.getCustomPlayersByLeague(leagueId.value)

  return [...apiPlayers, ...customPlayers]
})

const filteredPlayers = computed(() => {
  let players = [...allPlayers.value]

  if (searchPlayer.value) {
    players = players.filter(playerData =>
        playerData.player?.name
            ?.toLowerCase()
            .includes(searchPlayer.value.toLowerCase())
    )
  }

  if (searchTeam.value) {
    players = players.filter(playerData =>
        playerData.statistics?.[0]?.team?.name
            ?.toLowerCase()
            .includes(searchTeam.value.toLowerCase())
    )
  }

  if (sortOption.value === 'goalsDesc') {
    players.sort((a, b) =>
        (b.statistics?.[0]?.goals?.total ?? 0) -
        (a.statistics?.[0]?.goals?.total ?? 0)
    )
  }

  if (sortOption.value === 'goalsAsc') {
    players.sort((a, b) =>
        (a.statistics?.[0]?.goals?.total ?? 0) -
        (b.statistics?.[0]?.goals?.total ?? 0)
    )
  }

  if (sortOption.value === 'nameAsc') {
    players.sort((a, b) =>
        (a.player?.name || '').localeCompare(b.player?.name || '')
    )
  }

  if (sortOption.value === 'nameDesc') {
    players.sort((a, b) =>
        (b.player?.name || '').localeCompare(a.player?.name || '')
    )
  }

  if (sortOption.value === 'teamAsc') {
    players.sort((a, b) =>
        (a.statistics?.[0]?.team?.name || '').localeCompare(
            b.statistics?.[0]?.team?.name || ''
        )
    )
  }

  return players.slice(0, 15)
})

const goHome = () => {
  router.push('/')
}

onMounted(() => {
  playerStore.fetchTopPlayersByLeague(route.params.id)
})
</script>

<template>
  <v-container class="league-page">
    <section v-if="league" class="league-hero">
      <v-btn
          class="back-btn"
          prepend-icon="mdi-arrow-left"
          variant="outlined"
          @click="goHome"
      >
        Retour
      </v-btn>

      <div class="league-hero-content">
        <div class="league-logo-wrapper">
          <v-img
              :src="league.logo"
              :alt="`Logo ${league.name}`"
              width="90"
              height="90"
              contain
          />
        </div>

        <p class="eyebrow">Championnat</p>

        <h1>{{ league.name }}</h1>

        <p class="country">
          {{ league.country }}
        </p>

        <div class="hero-chips">
          <v-chip color="primary" variant="flat">
            {{ filteredPlayers.length }} joueurs affichés
          </v-chip>

          <v-chip color="info" variant="tonal">
            Saison 2024 - 2025
          </v-chip>
        </div>
      </div>

      <v-icon class="hero-ball" icon="mdi-soccer" />
    </section>

    <v-alert v-else type="warning" variant="tonal" class="mb-6">
      Ligue introuvable pour l'id: {{ route.params.id }}
    </v-alert>

    <v-card class="filters-card pa-4 mb-6">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
              v-model="searchPlayer"
              label="Rechercher un joueur"
              prepend-inner-icon="mdi-account-search"
              variant="outlined"
              clearable
              hide-details
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
              v-model="searchTeam"
              label="Rechercher un club"
              prepend-inner-icon="mdi-shield-search"
              variant="outlined"
              clearable
              hide-details
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
              v-model="sortOption"
              label="Trier par"
              :items="[
              { title: 'Buts décroissant', value: 'goalsDesc' },
              { title: 'Buts croissant', value: 'goalsAsc' },
              { title: 'Nom A-Z', value: 'nameAsc' },
              { title: 'Nom Z-A', value: 'nameDesc' },
              { title: 'Club A-Z', value: 'teamAsc' }
            ]"
              variant="outlined"
              hide-details
          />
        </v-col>
      </v-row>
    </v-card>

    <v-row v-if="playerStore.isLoading">
      <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
        <v-skeleton-loader type="card" />
      </v-col>
    </v-row>

    <v-alert
        v-else-if="playerStore.error && allPlayers.length === 0"
        type="error"
        variant="tonal"
        class="mb-4"
    >
      {{ playerStore.error }}
    </v-alert>

    <v-row v-else>
      <v-col
          v-for="playerData in filteredPlayers"
          :key="playerData.player?.id"
          cols="12"
          sm="6"
          md="4"
      >
        <v-card class="player-card h-100">
          <div class="card-top-line" />

          <v-btn
              class="position-absolute favorite-btn"
              :icon="playerStore.isFavorite(playerData.player?.id) ? 'mdi-heart' : 'mdi-heart-outline'"
              :color="playerStore.isFavorite(playerData.player?.id) ? 'red' : 'grey'"
              variant="text"
              @click="playerStore.toggleFavorite(playerData)"
          />

          <v-btn
              v-if="playerData.custom && authStore.isLoggedIn"
              class="position-absolute delete-btn"
              icon="mdi-delete"
              color="red"
              variant="text"
              @click="playerStore.deleteCustomPlayer(playerData.player?.id)"
          />

          <div class="player-image-wrapper">
            <v-img
                :src="playerData.player?.photo"
                :alt="`Photo de ${playerData.player?.name || 'joueur'}`"
                max-width="145"
                contain
            >
              <template #error>
                <v-img
                    src="/default-player.jpg"
                    max-width="145"
                    contain
                />
              </template>
            </v-img>
          </div>

          <v-card-title class="player-name">
            {{ playerData.player?.name || 'Joueur inconnu' }}
          </v-card-title>

          <v-card-subtitle class="player-team">
            <v-icon icon="mdi-shield" size="16" class="mr-1" />
            {{ playerData.statistics?.[0]?.team?.name || 'Équipe non disponible' }}
          </v-card-subtitle>

          <v-card-text>
            <div class="stats-grid">
              <div class="stat-box">
                <span class="stat-number">
                  {{ playerData.statistics?.[0]?.goals?.total ?? 0 }}
                </span>
                <span class="stat-label">Buts</span>
              </div>

              <div class="stat-box">
                <span class="stat-number">
                  {{ playerData.statistics?.[0]?.goals?.assists ?? 0 }}
                </span>
                <span class="stat-label">Passes</span>
              </div>

              <div class="stat-box">
                <span class="stat-number">
                  {{ playerData.statistics?.[0]?.games?.appearences ?? 0 }}
                </span>
                <span class="stat-label">Matchs</span>
              </div>
            </div>

            <div class="text-center mt-4">
              <v-chip
                  v-if="playerData.custom"
                  color="primary"
                  variant="tonal"
                  size="small"
              >
                Joueur personnalisé
              </v-chip>

              <v-chip
                  v-else
                  color="info"
                  variant="tonal"
                  size="small"
              >
                API Football
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col v-if="filteredPlayers.length === 0" cols="12">
        <v-alert type="info" variant="tonal">
          Aucun joueur ne correspond à ta recherche.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.league-page {
  max-width: 1200px;
  padding-top: 32px;
  padding-bottom: 70px;
}

.league-hero {
  position: relative;
  overflow: hidden;
  min-height: 240px;
  border-radius: 28px;
  margin-bottom: 26px;
  padding: 34px;
  background:
      linear-gradient(135deg, rgba(181, 44, 18, 0.92), rgba(18, 18, 18, 0.96)),
      url('/football-bg.png');
  background-size: cover;
  background-position: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.league-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
      linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 34px 34px;
  pointer-events: none;
}

.back-btn {
  position: relative;
  z-index: 2;
}

.league-hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-top: -8px;
}

.league-logo-wrapper {
  width: 115px;
  height: 115px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
}

.eyebrow {
  color: #ffffff;
  opacity: 0.85;
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 2px;
  margin-bottom: 4px;
}

.league-hero h1 {
  font-size: 42px;
  font-weight: 900;
  margin-bottom: 6px;
}

.country {
  color: #eeeeee;
  margin-bottom: 16px;
}

.hero-chips {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.hero-ball {
  position: absolute;
  right: 42px;
  bottom: -28px;
  font-size: 190px;
  opacity: 0.12;
  transform: rotate(-18deg);
}

.filters-card {
  border: 1px solid rgba(181, 44, 18, 0.25);
}

.player-card {
  position: relative;
  overflow: hidden;
  padding: 22px;
  background: linear-gradient(180deg, #202020, #191919);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.player-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 14px 30px rgba(181, 44, 18, 0.18);
}

.card-top-line {
  position: absolute;
  inset: 0 0 auto 0;
  height: 4px;
  background: linear-gradient(90deg, #B52C12, #ff4b3e);
}

.favorite-btn {
  top: 12px;
  right: 12px;
  z-index: 2;
  transition: transform 0.2s ease;
}

.delete-btn {
  top: 52px;
  right: 12px;
  z-index: 2;
  transition: transform 0.2s ease;
}

.favorite-btn:hover,
.delete-btn:hover {
  transform: scale(1.2);
}

.player-image-wrapper {
  height: 190px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.player-name {
  text-align: center;
  font-weight: 900;
  font-size: 18px;
  padding-bottom: 4px;
}

.player-team {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bdbdbd;
  margin-bottom: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
}

.stat-box {
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  padding: 12px 8px;
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 22px;
  font-weight: 900;
  color: #ffffff;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #bdbdbd;
}

@media (max-width: 800px) {
  .league-hero {
    padding: 24px;
  }

  .league-hero h1 {
    font-size: 32px;
  }

  .hero-ball {
    display: none;
  }

  .back-btn {
    margin-bottom: 18px;
  }
}
</style>