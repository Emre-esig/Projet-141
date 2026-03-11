<template>
  <v-container>
    <h1 class="text-h4 my-4">Clubs de Turquie</h1>

    <!-- Chargement (skeleton) -->
    <v-row v-if="loading">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="image, heading, text" />
      </v-col>
    </v-row>

    <!-- Erreur -->
    <v-alert v-else-if="error" type="error" class="my-4">
      {{ error }}
    </v-alert>

    <!-- Liste des clubs -->
    <v-row v-else>
      <v-col cols="12" class="mb-4">
        <p>{{ teams.length }} club(s) chargé(s)</p>
      </v-col>

      <v-col
        v-for="item in teams"
        :key="(item.team && item.team.id) || item.id || item.name"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card>
          <v-img
            v-if="item.team && item.team.logo"
            :src="item.team.logo"
            height="140"
            contain
          />

          <v-card-title>
            {{ item.team ? item.team.name : (item.name || 'Inconnu') }}
          </v-card-title>

          <v-card-subtitle v-if="item.venue && item.venue.name">
            {{ item.venue.name }}
          </v-card-subtitle>

          <v-card-text>
            <div v-if="item.team && item.team.id">
              ID: {{ item.team.id }}
            </div>
            <div v-else>
              Aucune information disponible.
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn text small @click="() => onInspect(item)">Inspecter</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// État réactif
const teams = ref([])
const loading = ref(true)
const error = ref(null)

// Chargement des données au montage du composant
const API_KEY = import.meta.env.VITE_APISPORTS_KEY || "12e804a9f1d0a2b8a9da6f1951f992a2"
const BASE_URL = 'https://v3.football.api-sports.io'

const myHeaders = new Headers()
myHeaders.append('x-apisports-key', API_KEY)

const requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
}

function onInspect(item) {
  // Ouverture d'une inspection rapide dans la console
  console.debug('Inspect team', item)
  alert(JSON.stringify(item, null, 2))
}

onMounted(async () => {
  try {
    const country = encodeURIComponent('Turkey')
    console.debug('Fetch teams for country=Turkey with options:', requestOptions)
    const response = await fetch(`${BASE_URL}/teams?country=${country}`, requestOptions)
    console.debug('Fetch response status:', response.status)

    if (!response.ok) {
      // Essayer d'extraire un message d'erreur plus descriptif
      let msg = `Erreur ${response.status}`
      try {
        const body = await response.text()
        msg += `: ${body}`
      } catch (e) {
        // ignore
      }
      error.value = `Erreur lors du chargement: ${msg}`
      return
    }

    const data = await response.json()
    console.debug('API data sample:', data)
    teams.value = data.response || data.results || []

    // Cas où la réponse est vide
    if (!teams.value || teams.value.length === 0) {
      error.value = 'Aucun club trouvé pour la Turquie.'
    }
  } catch (err) {
    // Erreurs typiques : réseau, CORS, clé invalide
    console.error('Fetch error:', err)
    error.value = `Impossible de charger les clubs : ${err.message}`
  } finally {
    loading.value = false
  }
})
</script>
