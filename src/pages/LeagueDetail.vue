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
  <v-container>
    <v-card class="mb-6 pa-4 league-header-card" variant="tonal">
      <div v-if="league" class="league-header">
        <v-btn
            class="back-btn"
            prepend-icon="mdi-arrow-left"
            variant="outlined"
            @click="goHome"
        >
          Retour
        </v-btn>

        <div class="league-info text-center">
          <v-img
              :src="league.logo"
              :alt="`Logo ${league.name}`"
              width="80"
              height="80"
              class="mx-auto mb-2"
              contain
          />

          <h1 class="text-h4 mb-1">{{ league.name }}</h1>

          <p class="text-subtitle-1 text-medium-emphasis mb-0">
            {{ league.country }}
          </p>

          <v-chip color="primary" variant="flat" class="mt-3">
            {{ filteredPlayers.length }} joueurs affichés
          </v-chip>
        </div>
      </div>

      <v-alert v-else type="warning" variant="tonal">
        Ligue introuvable pour l'id: {{ route.params.id }}
      </v-alert>
    </v-card>

    <v-card class="mb-6 pa-4">
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
        <v-card class="h-100 pa-3 position-relative player-card">
          <v-btn
              class="position-absolute favorite-btn"
              style="top: 10px; right: 10px; z-index: 2;"
              :icon="playerStore.isFavorite(playerData.player?.id) ? 'mdi-heart' : 'mdi-heart-outline'"
              :color="playerStore.isFavorite(playerData.player?.id) ? 'red' : 'grey'"
              variant="text"
              @click="playerStore.toggleFavorite(playerData)"
          />

          <v-btn
              v-if="playerData.custom && authStore.isLoggedIn"
              class="position-absolute"
              style="top: 50px; right: 10px; z-index: 2;"
              icon="mdi-delete"
              color="red"
              variant="text"
              @click="playerStore.deleteCustomPlayer(playerData.player?.id)"
          />

          <div class="d-flex justify-center align-center" style="height: 200px;">
            <v-img
                :src="playerData.player?.photo"
                :alt="`Photo de ${playerData.player?.name || 'joueur'}`"
                max-width="140"
                contain
            >
              <template #error>
                <v-img
                    src="/default-player.jpg"
                    max-width="140"
                    contain
                />
              </template>
            </v-img>
          </div>

          <v-card-title class="text-subtitle-1 font-weight-bold text-center">
            {{ playerData.player?.name || 'Joueur inconnu' }}
          </v-card-title>

          <v-card-subtitle class="text-center mb-3">
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
              >
                Joueur personnalisé
              </v-chip>

              <v-chip
                  v-else
                  color="info"
                  variant="tonal"
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
.league-header-card {
  position: relative;
}

.league-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn {
  position: absolute;
  left: 0;
}

.league-info {
  width: 100%;
}

.player-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.player-card:hover {
  transform: translateY(-4px);
}

.favorite-btn {
  transition: transform 0.2s ease;
}

.favorite-btn:hover {
  transform: scale(1.25);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.stat-box {
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 10px;
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #bdbdbd;
}

@media (max-width: 600px) {
  .league-header {
    flex-direction: column;
    gap: 16px;
  }

  .back-btn {
    position: static;
    align-self: flex-start;
  }
}
</style>