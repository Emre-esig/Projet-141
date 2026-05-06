<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'

const router = useRouter()
const playerStore = usePlayerStore()

const form = ref(null)
const snackbar = ref(false)
const message = ref('')
const color = ref('success')

const player = ref({
  name: '',
  team: '',
  leagueId: null,
  photo: '',
  goals: 0,
  assists: 0,
  appearances: 0
})

const rules = {
  required: value => !!value || 'Champ obligatoire',
  positive: value => value >= 0 || 'La valeur doit être positive'
}

watch(
    () => player.value.leagueId,
    async (newLeagueId) => {
      player.value.team = ''

      if (newLeagueId) {
        await playerStore.fetchTeamsByLeague(newLeagueId)
      }
    }
)

const addPlayer = async () => {
  const resultValidation = await form.value.validate()

  if (!resultValidation.valid) {
    return
  }

  const result = playerStore.addCustomPlayer(player.value)

  message.value = result.message
  color.value = result.success ? 'success' : 'error'
  snackbar.value = true

  if (result.success) {
    setTimeout(() => {
      router.push(`/league/${player.value.leagueId}`)
    }, 800)
  }
}
</script>

<template>
  <v-container>
    <v-card class="pa-6 mx-auto" max-width="700">
      <h1 class="text-h4 text-center mb-6">
        Ajouter un joueur
      </h1>

      <v-form ref="form" @submit.prevent="addPlayer">
        <v-text-field
            v-model="player.name"
            label="Nom du joueur"
            variant="outlined"
            :rules="[rules.required]"
        />

        <v-select
            v-model="player.leagueId"
            label="Ligue"
            :items="playerStore.leagues"
            item-title="name"
            item-value="id"
            variant="outlined"
            :rules="[rules.required]"
        />

        <v-select
            v-model="player.team"
            label="Équipe"
            :items="playerStore.teams"
            item-title="name"
            item-value="name"
            variant="outlined"
            :rules="[rules.required]"
            :loading="playerStore.isLoadingTeams"
            :disabled="!player.leagueId"
            no-data-text="Aucune équipe trouvée"
        />

        <v-text-field
            v-model="player.photo"
            label="URL de la photo"
            variant="outlined"
        />

        <v-text-field
            v-model.number="player.goals"
            label="Buts"
            type="number"
            variant="outlined"
            :rules="[rules.positive]"
        />

        <v-text-field
            v-model.number="player.assists"
            label="Passes décisives"
            type="number"
            variant="outlined"
            :rules="[rules.positive]"
        />

        <v-text-field
            v-model.number="player.appearances"
            label="Matchs"
            type="number"
            variant="outlined"
            :rules="[rules.positive]"
        />

        <v-btn
            type="submit"
            color="primary"
            block
            size="large"
        >
          Ajouter
        </v-btn>
      </v-form>
    </v-card>

    <v-snackbar v-model="snackbar" :color="color">
      {{ message }}
    </v-snackbar>
  </v-container>
</template>