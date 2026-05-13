<script setup>
import {computed, onMounted, ref} from 'vue'
import {usePlayerStore} from '@/stores/playerStore'

const playerStore = usePlayerStore()

const dialog = ref(false)
const selectedPlayer = ref(null)
const snackbar = ref(false)

const totalGoals = computed(() => {
  return playerStore.favoritePlayers.reduce((total, playerData) => {
    return total + (playerData.statistics?.[0]?.goals?.total ?? 0)
  }, 0)
})

const totalAssists = computed(() => {
  return playerStore.favoritePlayers.reduce((total, playerData) => {
    return total + (playerData.statistics?.[0]?.goals?.assists ?? 0)
  }, 0)
})

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
  <v-container class="favorites-page">
    <section class="favorites-hero">
      <div class="hero-content">
        <p class="eyebrow">Sélection personnelle</p>

        <h1>Mes favoris</h1>

        <p class="description">
          Retrouve ici les joueurs que tu as sélectionnés parmi les différentes ligues.
        </p>

        <div class="hero-stats">
          <v-chip color="primary" variant="flat">
            {{ playerStore.favoritePlayers.length }} favoris
          </v-chip>

          <v-chip color="info" variant="tonal">
            {{ totalGoals }} buts
          </v-chip>

          <v-chip color="success" variant="tonal">
            {{ totalAssists }} passes
          </v-chip>
        </div>
      </div>

      <v-icon class="hero-icon" icon="mdi-heart"/>
    </section>

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
        <v-card class="player-card h-100">
          <div class="card-top-line"/>

          <v-btn
              class="position-absolute delete-btn"
              icon="mdi-delete"
              color="red"
              variant="text"
              @click="openDeleteDialog(playerData)"
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
            <v-icon icon="mdi-shield" size="16" class="mr-1"/>
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
    </v-row>

    <v-dialog v-model="dialog" max-width="500">
      <v-card class="confirm-card">
        <v-card-title class="text-h5">
          Confirmer la suppression
        </v-card-title>

        <v-card-text>
          Veux-tu vraiment supprimer
          <strong>{{ selectedPlayer?.player?.name }}</strong>
          de tes favoris ?
        </v-card-text>

        <v-card-actions>
          <v-spacer/>

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
.favorites-page {
  max-width: 1200px;
  padding-top: 32px;
  padding-bottom: 70px;
}

.favorites-hero {
  position: relative;
  overflow: hidden;
  min-height: 220px;
  border-radius: 28px;
  margin-bottom: 28px;
  padding: 38px;
  background: linear-gradient(135deg, rgba(181, 44, 18, 0.92), rgba(18, 18, 18, 0.96)),
  url('/football-bg.png');
  background-size: cover;
  background-position: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.favorites-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 34px 34px;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 720px;
}

.eyebrow {
  color: #ffffff;
  opacity: 0.85;
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.favorites-hero h1 {
  font-size: 46px;
  font-weight: 900;
  margin-bottom: 10px;
}

.description {
  color: #eeeeee;
  font-size: 17px;
  line-height: 1.6;
  margin-bottom: 0;
}

.hero-stats {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 22px;
}

.hero-icon {
  position: absolute;
  right: 46px;
  bottom: -20px;
  font-size: 180px;
  opacity: 0.12;
  transform: rotate(-12deg);
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

.delete-btn {
  top: 12px;
  right: 12px;
  z-index: 2;
  transition: transform 0.2s ease;
}

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

.confirm-card {
  border-top: 4px solid #B52C12;
}

@media (max-width: 800px) {
  .favorites-hero {
    padding: 28px;
  }

  .favorites-hero h1 {
    font-size: 34px;
  }

  .hero-icon {
    display: none;
  }
}
</style>