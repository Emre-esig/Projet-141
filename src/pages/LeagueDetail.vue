<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'

// 1) On récupère la route actuelle (pour lire /league/:id)
const route = useRoute()

// 2) On récupère le store Pinia
const playerStore = usePlayerStore()

// 3) On lit l'id de la ligue depuis l'URL
// Exemple: /league/39 -> leagueId = 39
const leagueId = computed(() => Number(route.params.id))

// 4) On récupère les infos de la ligue (nom, logo, pays) depuis le store
const league = computed(() => playerStore.getLeagueById(leagueId.value))

// 5) On ne garde que les 15 premiers joueurs pour l'affichage
const top15Players = computed(() => playerStore.players.slice(0, 15))

// 6) Quand la page s'affiche, on lance l'appel API pour charger les joueurs
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
      <!-- Si la ligue existe dans le store -->
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

      <!-- Si l'id ne correspond a aucune ligue -->
      <v-alert v-else type="warning" variant="tonal">
        Ligue introuvable pour l'id: {{ route.params.id }}
      </v-alert>
    </v-card>

    <!-- =========================
         ETAT 1: Chargement
         ========================= -->
    <v-row v-if="playerStore.isLoading">
      <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
        <v-skeleton-loader type="card" />
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
         ETAT 3: Donnees (joueurs)
         ========================= -->
    <v-row v-else>
      <v-col
          v-for="playerData in top15Players"
          :key="playerData.player?.id"
          cols="12"
          sm="6"
          md="4"
      >
        <v-card class="h-100 pa-2">
          <!-- Photo du joueur -->
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
            <!-- Statistiques principales -->
            <div><strong>Buts:</strong> {{ playerData.statistics?.[0]?.goals?.total ?? 0 }}</div>
            <div><strong>Passes decisives:</strong> {{ playerData.statistics?.[0]?.goals?.assists ?? 0 }}</div>
            <div><strong>Matchs:</strong> {{ playerData.statistics?.[0]?.games?.appearences ?? 0 }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Cas où l'API répond mais sans joueur -->
      <v-col v-if="top15Players.length === 0" cols="12">
        <v-alert type="info" variant="tonal">
          Aucun joueur trouve pour cette ligue.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>
