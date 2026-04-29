<script setup>
import { usePlayerStore } from '@/stores/playerStore'
import LeagueCard from '../components/LeagueCard.vue'

// Page liste: on lit les ligues depuis Pinia (une seule source de vérité)
const playerStore = usePlayerStore()
</script>

<template>
  <v-container>
    <h1 class="text-h4 mb-6">Top championnats</h1>

    <v-row>
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
