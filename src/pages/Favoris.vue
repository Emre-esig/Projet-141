<script setup>
import { onMounted } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'

const playerStore = usePlayerStore()

onMounted(() => {
  playerStore.loadFavorites()
})
</script>

<template>
  <v-container>
    <h1 class="text-h3 text-center my-8">
      Mes favoris
    </h1>

    <v-alert
        v-if="playerStore.favoritePlayers.length === 0"
        type="info"
        variant="tonal"
        class="mb-6"
    >
      Aucun joueur favori pour le moment.
    </v-alert>

    <v-row v-else>
      <v-col
          v-for="playerData in playerStore.favoritePlayers"
          :key="playerData.player?.id"
          cols="12"
          sm="6"
          md="4"
      >
        <v-card class="h-100 pa-2 position-relative">
          <v-btn
              class="position-absolute favorite-btn"
              style="top: 10px; right: 10px; z-index: 2;"
              icon="mdi-heart"
              color="red"
              variant="text"
              @click="playerStore.toggleFavorite(playerData)"
          />

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
    </v-row>
  </v-container>
</template>

<style scoped>
.favorite-btn {
  transition: transform 0.2s ease;
}

.favorite-btn:hover {
  transform: scale(1.25);
}
</style>