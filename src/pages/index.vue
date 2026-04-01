<script setup>
import LeagueCard from '../components/LeagueCard.vue'

const leagues = [
  {
    id: 39,
    name: 'Premier League',
    country: 'Angleterre',
    logo: 'https://media.api-sports.io/football/leagues/39.png'
  },
  {
    id: 140,
    name: 'La Liga',
    country: 'Espagne',
    logo: 'https://media.api-sports.io/football/leagues/140.png'
  },
  {
    id: 61,
    name: 'Ligue 1',
    country: 'France',
    logo: 'https://media.api-sports.io/football/leagues/61.png'
  },
  {
    id: 78,
    name: 'Bundesliga',
    country: 'Allemagne',
    logo: 'https://media.api-sports.io/football/leagues/78.png'
  },
  {
    id: 135,
    name: 'Serie A',
    country: 'Italie',
    logo: 'https://media.api-sports.io/football/leagues/135.png'
  },
  {
    id: 203,
    name: 'Süper Lig',
    country: 'Turquie',
    logo: 'https://media.api-sports.io/football/leagues/203.png'
  }
]
</script>

<template>
  <v-container>
    <h1 class="text-h4 mb-6">Top championnats</h1>

    <v-row>
      <v-col
          v-for="league in leagues"
          :key="league.id"
          cols="12"
          sm="6"
          md="4"
      >
        <LeagueCard :league="league"/>
      </v-col>
    </v-row>
  </v-container>
</template>