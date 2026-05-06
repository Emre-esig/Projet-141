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
        <v-card class="h-100 pa-2 position-relative">
          <v-btn
              class="position-absolute favorite-btn"
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

            <v-chip
                v-if="playerData.custom"
                color="primary"
                variant="tonal"
                class="mt-3"
            >
              Joueur personnalisé
            </v-chip>
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
.favorite-btn {
  transition: transform 0.2s ease;
}

.favorite-btn:hover {
  transform: scale(1.25);
}
</style>