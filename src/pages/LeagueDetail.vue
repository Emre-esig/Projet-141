<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import {usePlayerStore} from '@/stores/playerStore'

// 1) On récupère la route actuelle (pour lire /league/:id)
const route = useRoute()

// 2) On récupère le store Pinia
const playerStore = usePlayerStore()

// 3) On lit l'id de la ligue depuis l'URL
// Exemple: /league/39 -> leagueId = 39
const leagueId = computed(() => Number(route.params.id))

// 4) On récupère les infos de la ligue (nom, logo, pays) depuis le store
const league = computed(() => playerStore.getLeagueById(leagueId.value))

// 5) Variables pour les recherches et les tris
const searchPlayer = ref('')
const searchTeam = ref('')
const sortOption = ref('goalsDesc')

// 6) Liste des joueurs filtrée et triée
const filteredPlayers = computed(() => {
  let players = [...playerStore.players]

  // Recherche par nom du joueur
  if (searchPlayer.value) {
    players = players.filter(playerData =>
        playerData.player?.name
            ?.toLowerCase()
            .includes(searchPlayer.value.toLowerCase())
    )
  }

  // Recherche par nom du club
  if (searchTeam.value) {
    players = players.filter(playerData =>
        playerData.statistics?.[0]?.team?.name
            ?.toLowerCase()
            .includes(searchTeam.value.toLowerCase())
    )
  }

  // Tri par buts décroissant
  if (sortOption.value === 'goalsDesc') {
    players.sort((a, b) =>
        (b.statistics?.[0]?.goals?.total ?? 0) -
        (a.statistics?.[0]?.goals?.total ?? 0)
    )
  }

  // Tri par buts croissant
  if (sortOption.value === 'goalsAsc') {
    players.sort((a, b) =>
        (a.statistics?.[0]?.goals?.total ?? 0) -
        (b.statistics?.[0]?.goals?.total ?? 0)
    )
  }

  // Tri par nom A-Z
  if (sortOption.value === 'nameAsc') {
    players.sort((a, b) =>
        (a.player?.name || '').localeCompare(b.player?.name || '')
    )
  }

  // Tri par nom Z-A
  if (sortOption.value === 'nameDesc') {
    players.sort((a, b) =>
        (b.player?.name || '').localeCompare(a.player?.name || '')
    )
  }

  // Tri par club A-Z
  if (sortOption.value === 'teamAsc') {
    players.sort((a, b) =>
        (a.statistics?.[0]?.team?.name || '').localeCompare(
            b.statistics?.[0]?.team?.name || ''
        )
    )
  }

  return players.slice(0, 15)
})

// 7) Quand la page s'affiche, on lance l'appel API pour charger les joueurs
onMounted(() => {
  // Contrainte demandée: appel avec route.params.id
  playerStore.fetchTopPlayersByLeague(route.params.id)
})
</script>

<template>
  <v-container>
    <!-- =========================
         EN-TETE: infos de la ligue
         ========================= -->
    <v-card class="mb-6 pa-4" variant="tonal">
      <div v-if="league" class="text-center">
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
      </div>

      <v-alert v-else type="warning" variant="tonal">
        Ligue introuvable pour l'id: {{ route.params.id }}
      </v-alert>
    </v-card>

    <!-- =========================
         BARRE DE RECHERCHE ET TRI
         ========================= -->
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

    <!-- =========================
         ETAT 1: Chargement
         ========================= -->
    <v-row v-if="playerStore.isLoading">
      <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
        <v-skeleton-loader type="card"/>
      </v-col>
    </v-row>

    <!-- =========================
         ETAT 2: Erreur
         ========================= -->
    <v-alert
        v-else-if="playerStore.error"
        type="error"
        variant="tonal"
        class="mb-4"
    >
      {{ playerStore.error }}
    </v-alert>

    <!-- =========================
         ETAT 3: Donnees joueurs
         ========================= -->
    <v-row v-else>
      <v-col
          v-for="playerData in filteredPlayers"
          :key="playerData.player?.id"
          cols="12"
          sm="6"
          md="4"
      >
        <v-card class="h-100 pa-2">
          <div class="d-flex justify-center align-center" style="height: 200px;">
            <v-img
                :src="playerData.player?.photo"
                :alt="`Photo de ${playerData.player?.name || 'joueur'}`"
                max-width="140"
                contain
            />
          </div>

          <v-card-title class="text-subtitle-1 font-weight-bold">
            {{ playerData.player?.name || 'Joueur inconnu' }}
          </v-card-title>

          <v-card-subtitle>
            Equipe:
            {{ playerData.statistics?.[0]?.team?.name || 'Non disponible' }}
          </v-card-subtitle>

          <v-card-text>
            <div>
              <strong>Buts:</strong>
              {{ playerData.statistics?.[0]?.goals?.total ?? 0 }}
            </div>

            <div>
              <strong>Passes decisives:</strong>
              {{ playerData.statistics?.[0]?.goals?.assists ?? 0 }}
            </div>

            <div>
              <strong>Matchs:</strong>
              {{ playerData.statistics?.[0]?.games?.appearences ?? 0 }}
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