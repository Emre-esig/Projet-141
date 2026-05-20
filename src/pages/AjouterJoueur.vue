<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'

// Router utilisé pour rediriger l'utilisateur après l'ajout du joueur
const router = useRouter()

// Store Pinia principal : ligues, équipes, joueurs personnalisés
const playerStore = usePlayerStore()

// Référence du formulaire Vuetify pour pouvoir lancer validate()
const form = ref(null)

// Snackbar = petite notification en bas de page
const snackbar = ref(false)

// Message affiché dans la snackbar
const message = ref('')

// Couleur de la snackbar : success ou error
const color = ref('success')

// Données saisies dans le formulaire
const player = ref({
  name: '',
  team: '',
  leagueId: null,
  photo: '',
  goals: 0,
  assists: 0,
  appearances: 0
})

// Règles de validation utilisées par les champs Vuetify
const rules = {
  // Champ obligatoire
  required: value => !!value || 'Champ obligatoire',

  // Nombre positif ou égal à zéro
  positive: value => value >= 0 || 'La valeur doit être positive'
}

// Surveille le changement de ligue
watch(
    () => player.value.leagueId,
    async (newLeagueId) => {
      // Quand on change de ligue, on vide l'équipe sélectionnée
      player.value.team = ''

      // Si une ligue est sélectionnée, on charge ses équipes via l'API
      if (newLeagueId) {
        await playerStore.fetchTeamsByLeague(newLeagueId)
      }
    }
)

// Fonction appelée quand on soumet le formulaire
const addPlayer = async () => {
  // Lance la validation du formulaire
  const resultValidation = await form.value.validate()

  // Si le formulaire n'est pas valide, on arrête
  if (!resultValidation.valid) {
    return
  }

  // Ajoute le joueur personnalisé via le store
  const result = playerStore.addCustomPlayer(player.value)

  // Prépare le message de retour
  message.value = result.message
  color.value = result.success ? 'success' : 'error'
  snackbar.value = true

  // Si l'ajout est réussi, on redirige vers la page de la ligue
  if (result.success) {
    setTimeout(() => {
      router.push(`/league/${player.value.leagueId}`)
    }, 800)
  }
}
</script>

<template>
  <v-container class="add-page">
    <!-- Bannière du haut de page -->
    <section class="add-hero">
      <div>
        <p class="eyebrow">Création personnalisée</p>

        <h1>Ajouter un joueur</h1>

        <p class="description">
          Crée ton propre joueur, choisis sa ligue, son équipe et ajoute ses statistiques.
        </p>
      </div>

      <!-- Icône décorative -->
      <v-icon class="hero-icon" icon="mdi-account-plus" />
    </section>

    <!-- Carte principale du formulaire -->
    <v-card class="form-card pa-6 mx-auto" max-width="760">
      <!-- En-tête du formulaire -->
      <div class="form-header">
        <v-icon icon="mdi-soccer" color="primary" size="38" />

        <div>
          <h2>Nouveau joueur</h2>
          <p>Les champs avec une ligue et une équipe sont obligatoires.</p>
        </div>
      </div>

      <!-- Formulaire Vuetify -->
      <v-form ref="form" @submit.prevent="addPlayer">
        <!-- Champ du nom du joueur -->
        <v-text-field
            v-model="player.name"
            label="Nom du joueur"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            :rules="[rules.required]"
        />

        <!-- Ligne contenant la ligue et l'équipe -->
        <v-row>
          <!-- Sélection de la ligue -->
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

          <!-- Sélection de l'équipe -->
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

        <!-- URL de la photo du joueur -->
        <v-text-field
            v-model="player.photo"
            label="URL de la photo"
            prepend-inner-icon="mdi-image"
            variant="outlined"
        />

        <!-- Ligne des statistiques -->
        <v-row>
          <!-- Nombre de buts -->
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

          <!-- Nombre de passes décisives -->
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

          <!-- Nombre de matchs joués -->
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

        <!-- Information image par défaut -->
        <v-alert type="info" variant="tonal" class="mb-4">
          Si aucune image n’est ajoutée, une image par défaut sera utilisée.
        </v-alert>

        <!-- Bouton de soumission -->
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

    <!-- Notification après ajout ou erreur -->
    <v-snackbar v-model="snackbar" :color="color">
      {{ message }}
    </v-snackbar>
  </v-container>
</template>

<style scoped>
/* Conteneur principal de la page */
.add-page {
  max-width: 1100px;
  padding-top: 32px;
  padding-bottom: 70px;
}

/* Bannière du haut */
.add-hero {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  margin-bottom: 28px;
  padding: 38px;
  background:
      linear-gradient(135deg, rgba(181, 44, 18, 0.92), rgba(18, 18, 18, 0.96)),
      url('/football-bg.png');
  background-size: cover;
  background-position: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Grille décorative par-dessus la bannière */
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

/* Place le texte au-dessus de la grille décorative */
.add-hero > div {
  position: relative;
  z-index: 2;
}

/* Petit sous-titre */
.eyebrow {
  color: #ffffff;
  opacity: 0.85;
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

/* Titre principal */
.add-hero h1 {
  font-size: 44px;
  font-weight: 900;
  margin-bottom: 10px;
}

/* Description de la bannière */
.description {
  max-width: 650px;
  color: #eeeeee;
  font-size: 17px;
  line-height: 1.6;
  margin-bottom: 0;
}

/* Icône décorative à droite */
.hero-icon {
  position: absolute;
  right: 46px;
  bottom: -20px;
  font-size: 180px;
  opacity: 0.12;
  transform: rotate(-10deg);
}

/* Carte du formulaire */
.form-card {
  background: linear-gradient(180deg, #202020, #191919);
  border: 1px solid rgba(181, 44, 18, 0.25);
}

/* En-tête du formulaire */
.form-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

/* Titre Nouveau joueur */
.form-header h2 {
  font-size: 26px;
  font-weight: 900;
  margin-bottom: 4px;
}

/* Texte sous le titre */
.form-header p {
  color: #bdbdbd;
  margin-bottom: 0;
}

/* Adaptation mobile */
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