<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import PlayerCard from '../components/PlayerCard.vue'

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()

const leagueId = Number(route.params.id)

const league = computed(() => playerStore.getLeagueById(leagueId))
const players = computed(() => playerStore.getTopScorersByLeague(leagueId))
const loading = computed(() => playerStore.loading)
const error = computed(() => playerStore.error)

onMounted(async () => {
  await playerStore.fetchTopScorersByLeague(leagueId)
})
</script>

<template>
  <v-container class="text-white">
    <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        class="mb-4"
        @click="router.back()"
    >
      Retour
    </v-btn>

    <div v-if="!league">
      <v-alert type="error" variant="tonal">
        Championnat introuvable.
      </v-alert>
    </div>

    <div v-else>
      <h1 class="text-h4 mb-2">{{ league.name }}</h1>
      <p class="mb-2">Pays : {{ league.country }}</p>

      <v-img
          :src="league.logo"
          width="120"
          class="mb-6"
      />
    </div>

    <div v-if="loading">
      <p>Chargement des joueurs...</p>
    </div>

    <div v-else-if="error">
      <v-alert type="error" variant="tonal">
        {{ error }}
      </v-alert>
    </div>

    <div v-else>
      <h2 class="text-h5 mb-4">Top 10 des meilleurs buteurs</h2>

      <v-row>
        <v-col
            v-for="playerData in players"
            :key="playerData.player.id"
            cols="12"
            sm="6"
            md="4"
        >
          <PlayerCard :playerData="playerData" />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>