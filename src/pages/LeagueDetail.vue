<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PlayerCard from '../components/PlayerCard.vue'

const route = useRoute()
const router = useRouter()

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

const leagueId = Number(route.params.id)
const league = leagues.find(l => l.id === leagueId)

const players = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await fetch(
        `https://v3.football.api-sports.io/players/topscorers?league=${leagueId}&season=2023`,
        {
          headers: {
            'x-apisports-key': '12e804a9f1d0a2b8a9da6f1951f992a2'
          }
        }
    )

    const data = await response.json()
    players.value = data.response.slice(0, 10)
  } catch (err) {
    error.value = 'Erreur lors du chargement des joueurs'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <v-container class="text-white">

    <!-- 🔙 Bouton retour -->
    <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        class="mb-4"
        @click="router.back()"
    >
      Retour
    </v-btn>

    <!-- ❌ Si championnat introuvable -->
    <div v-if="!league">
      <v-alert type="error" variant="tonal">
        Championnat introuvable.
      </v-alert>
    </div>

    <!-- ✅ Si championnat trouvé -->
    <div v-else>
      <h1 class="text-h4 mb-2">{{ league.name }}</h1>
      <p class="mb-2">Pays : {{ league.country }}</p>

      <v-img
          :src="league.logo"
          width="120"
          class="mb-6"
      />
    </div>

    <!-- ⏳ Chargement -->
    <div v-if="loading">
      <p>Chargement des joueurs...</p>
    </div>

    <!-- ❌ Erreur -->
    <div v-else-if="error">
      <v-alert type="error" variant="tonal">
        {{ error }}
      </v-alert>
    </div>

    <!-- ✅ Liste joueurs -->
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
          <PlayerCard :playerData="playerData"/>
        </v-col>
      </v-row>
    </div>

  </v-container>
</template>