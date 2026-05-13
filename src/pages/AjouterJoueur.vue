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
  <v-container class="add-page">
    <section class="add-hero">
      <div>
        <p class="eyebrow">Création personnalisée</p>

        <h1>Ajouter un joueur</h1>

        <p class="description">
          Crée ton propre joueur, choisis sa ligue, son équipe et ajoute ses statistiques.
        </p>
      </div>

      <v-icon class="hero-icon" icon="mdi-account-plus" />
    </section>

    <v-card class="form-card pa-6 mx-auto" max-width="760">
      <div class="form-header">
        <v-icon icon="mdi-soccer" color="primary" size="38" />

        <div>
          <h2>Nouveau joueur</h2>
          <p>Les champs avec une ligue et une équipe sont obligatoires.</p>
        </div>
      </div>

      <v-form ref="form" @submit.prevent="addPlayer">
        <v-text-field
            v-model="player.name"
            label="Nom du joueur"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            :rules="[rules.required]"
        />

        <v-row>
          <v-col cols="12" md="6">
            <v-select
                v-model="player.leagueId"
                label="Ligue"
                prepend-inner-icon="mdi-trophy"
                :items="playerStore.leagues"
                item-title="name"
                item-value="id"
                variant="outlined"
                :rules="[rules.required]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
                v-model="player.team"
                label="Équipe"
                prepend-inner-icon="mdi-shield"
                :items="playerStore.teams"
                item-title="name"
                item-value="name"
                variant="outlined"
                :rules="[rules.required]"
                :loading="playerStore.isLoadingTeams"
                :disabled="!player.leagueId"
                no-data-text="Aucune équipe trouvée"
            />
          </v-col>
        </v-row>

        <v-text-field
            v-model="player.photo"
            label="URL de la photo"
            prepend-inner-icon="mdi-image"
            variant="outlined"
        />

        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
                v-model.number="player.goals"
                label="Buts"
                prepend-inner-icon="mdi-soccer"
                type="number"
                variant="outlined"
                :rules="[rules.positive]"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
                v-model.number="player.assists"
                label="Passes décisives"
                prepend-inner-icon="mdi-handshake"
                type="number"
                variant="outlined"
                :rules="[rules.positive]"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
                v-model.number="player.appearances"
                label="Matchs"
                prepend-inner-icon="mdi-calendar-check"
                type="number"
                variant="outlined"
                :rules="[rules.positive]"
            />
          </v-col>
        </v-row>

        <v-alert type="info" variant="tonal" class="mb-4">
          Si aucune image n’est ajoutée, une image par défaut sera utilisée.
        </v-alert>

        <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            prepend-icon="mdi-plus"
        >
          Ajouter le joueur
        </v-btn>
      </v-form>
    </v-card>

    <v-snackbar v-model="snackbar" :color="color">
      {{ message }}
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.add-page {
  max-width: 1100px;
  padding-top: 32px;
  padding-bottom: 70px;
}

.add-hero {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  margin-bottom: 28px;
  padding: 38px;
  background:
      linear-gradient(135deg, rgba(181, 44, 18, 0.92), rgba(18, 18, 18, 0.96)),
      url('/football-bg.jpg');
  background-size: cover;
  background-position: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.add-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
      linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 34px 34px;
  pointer-events: none;
}

.add-hero > div {
  position: relative;
  z-index: 2;
}

.eyebrow {
  color: #ffffff;
  opacity: 0.85;
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.add-hero h1 {
  font-size: 44px;
  font-weight: 900;
  margin-bottom: 10px;
}

.description {
  max-width: 650px;
  color: #eeeeee;
  font-size: 17px;
  line-height: 1.6;
  margin-bottom: 0;
}

.hero-icon {
  position: absolute;
  right: 46px;
  bottom: -20px;
  font-size: 180px;
  opacity: 0.12;
  transform: rotate(-10deg);
}

.form-card {
  background: linear-gradient(180deg, #202020, #191919);
  border: 1px solid rgba(181, 44, 18, 0.25);
}

.form-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.form-header h2 {
  font-size: 26px;
  font-weight: 900;
  margin-bottom: 4px;
}

.form-header p {
  color: #bdbdbd;
  margin-bottom: 0;
}

@media (max-width: 800px) {
  .add-hero {
    padding: 28px;
  }

  .add-hero h1 {
    font-size: 34px;
  }

  .hero-icon {
    display: none;
  }

  .form-header {
    align-items: flex-start;
  }
}
</style>