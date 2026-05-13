<script setup>
import { onMounted, ref } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'

const playerStore = usePlayerStore()

const dialog = ref(false)
const selectedPlayer = ref(null)
const snackbar = ref(false)

onMounted(() => {
  playerStore.loadFavorites()
})

const openDeleteDialog = (playerData) => {
  selectedPlayer.value = playerData
  dialog.value = true
}

const confirmDelete = () => {
  if (selectedPlayer.value) {
    playerStore.deleteFavorite(selectedPlayer.value.player?.id)
    snackbar.value = true
  }

  dialog.value = false
  selectedPlayer.value = null
}
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
        <v-card class="h-100 pa-3 position-relative player-card">
          <v-btn
              class="position-absolute delete-btn"
              style="top: 10px; right: 10px; z-index: 2;"
              icon="mdi-delete"
              color="red"
              variant="text"
              @click="openDeleteDialog(playerData)"
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
    </v-row>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          Confirmer la suppression
        </v-card-title>

        <v-card-text>
          Veux-tu vraiment supprimer
          <strong>{{ selectedPlayer?.player?.name }}</strong>
          de tes favoris ?
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="dialog = false">
            Annuler
          </v-btn>

          <v-btn color="red" variant="flat" @click="confirmDelete">
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" color="success">
      Joueur supprimé des favoris.
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.player-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.player-card:hover {
  transform: translateY(-4px);
}

.delete-btn {
  transition: transform 0.2s ease;
}

.delete-btn:hover {
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
</style>