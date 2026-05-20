<script setup>
// computed : permet de créer des valeurs calculées automatiquement
// onMounted : permet d'exécuter du code quand la page est chargée
// ref : permet de créer des variables réactives simples
import { computed, onMounted, ref } from 'vue'

// useRoute : permet de lire l'URL actuelle
// useRouter : permet de changer de page avec router.push()
import { useRoute, useRouter } from 'vue-router'

// Store principal : ligues, joueurs, favoris, API, joueurs personnalisés
import { usePlayerStore } from '@/stores/playerStore'

// Store de connexion : permet de savoir si l'utilisateur est connecté
import { useAuthStore } from '@/stores/authStore'

// Récupère la route actuelle.
// Exemple : si l'URL est /league/39, route.params.id vaut 39.
const route = useRoute()

// Permet de rediriger l'utilisateur vers une autre page.
const router = useRouter()

// Accès au store des joueurs.
const playerStore = usePlayerStore()

// Accès au store d'authentification.
const authStore = useAuthStore()

// Récupère l'id de la ligue depuis l'URL.
// Number() transforme le texte en nombre.
// Exemple : "39" devient 39.
const leagueId = computed(() => Number(route.params.id))

// Récupère la ligue correspondant à l'id.
// Exemple : si leagueId vaut 39, on récupère la Premier League.
const league = computed(() => playerStore.getLeagueById(leagueId.value))

// Texte tapé dans le champ "Rechercher un joueur".
const searchPlayer = ref('')

// Texte tapé dans le champ "Rechercher un club".
const searchTeam = ref('')

// Option de tri choisie.
// Par défaut : buts décroissants.
const sortOption = ref('goalsDesc')

// Cette computed regroupe deux sources de joueurs :
// 1. Les joueurs venant de l'API Football
// 2. Les joueurs ajoutés manuellement par l'utilisateur
const allPlayers = computed(() => {
  // Joueurs récupérés depuis l'API.
  const apiPlayers = playerStore.players

  // Joueurs personnalisés liés à la ligue actuelle.
  const customPlayers = playerStore.getCustomPlayersByLeague(leagueId.value)

  // On fusionne les deux tableaux dans un seul tableau.
  return [...apiPlayers, ...customPlayers]
})

// Cette computed prépare la liste finale affichée à l'écran.
// Elle applique :
// - la recherche par joueur
// - la recherche par club
// - le tri
// - la limite à 15 joueurs
const filteredPlayers = computed(() => {
  // On copie le tableau pour éviter de modifier directement allPlayers.
  let players = [...allPlayers.value]

  // Si l'utilisateur a écrit quelque chose dans la recherche joueur.
  if (searchPlayer.value) {
    players = players.filter(playerData =>
        playerData.player?.name
            ?.toLowerCase()
            .includes(searchPlayer.value.toLowerCase())
    )
  }

  // Si l'utilisateur a écrit quelque chose dans la recherche club.
  if (searchTeam.value) {
    players = players.filter(playerData =>
        playerData.statistics?.[0]?.team?.name
            ?.toLowerCase()
            .includes(searchTeam.value.toLowerCase())
    )
  }

  // Tri par buts du plus grand au plus petit.
  if (sortOption.value === 'goalsDesc') {
    players.sort((a, b) =>
        (b.statistics?.[0]?.goals?.total ?? 0) -
        (a.statistics?.[0]?.goals?.total ?? 0)
    )
  }

  // Tri par buts du plus petit au plus grand.
  if (sortOption.value === 'goalsAsc') {
    players.sort((a, b) =>
        (a.statistics?.[0]?.goals?.total ?? 0) -
        (b.statistics?.[0]?.goals?.total ?? 0)
    )
  }

  // Tri alphabétique du nom du joueur : A à Z.
  if (sortOption.value === 'nameAsc') {
    players.sort((a, b) =>
        (a.player?.name || '').localeCompare(b.player?.name || '')
    )
  }

  // Tri alphabétique du nom du joueur : Z à A.
  if (sortOption.value === 'nameDesc') {
    players.sort((a, b) =>
        (b.player?.name || '').localeCompare(a.player?.name || '')
    )
  }

  // Tri alphabétique du club : A à Z.
  if (sortOption.value === 'teamAsc') {
    players.sort((a, b) =>
        (a.statistics?.[0]?.team?.name || '').localeCompare(
            b.statistics?.[0]?.team?.name || ''
        )
    )
  }

  // On affiche seulement les 15 premiers joueurs.
  return players.slice(0, 15)
})

// Fonction appelée quand on clique sur le bouton Retour.
const goHome = () => {
  router.push('/')
}

// Quand la page s'affiche,
// on appelle l'API pour charger les meilleurs buteurs de la ligue.
onMounted(() => {
  playerStore.fetchTopPlayersByLeague(route.params.id)
})
</script>

<template>
  <!-- Conteneur principal de la page détail ligue -->
  <v-container class="league-page">

    <!-- En-tête de la page si la ligue existe -->
    <section v-if="league" class="league-hero">

      <!-- Bouton pour revenir à la page d'accueil -->
      <v-btn
          class="back-btn"
          prepend-icon="mdi-arrow-left"
          variant="outlined"
          @click="goHome"
      >
        Retour
      </v-btn>

      <!-- Contenu central de l'en-tête -->
      <div class="league-hero-content">

        <!-- Bloc contenant le logo de la ligue -->
        <div class="league-logo-wrapper">
          <v-img
              :src="league.logo"
              :alt="`Logo ${league.name}`"
              width="90"
              height="90"
              contain
          />
        </div>

        <!-- Petit texte décoratif -->
        <p class="eyebrow">
          Championnat
        </p>

        <!-- Nom de la ligue -->
        <h1>
          {{ league.name }}
        </h1>

        <!-- Pays de la ligue -->
        <p class="country">
          {{ league.country }}
        </p>

        <!-- Petites pastilles d'informations -->
        <div class="hero-chips">

          <!-- Nombre de joueurs actuellement affichés après filtre -->
          <v-chip color="primary" variant="flat">
            {{ filteredPlayers.length }} joueurs affichés
          </v-chip>

          <!-- Saison utilisée dans l'API -->
          <v-chip color="info" variant="tonal">
            Saison 2024 - 2025
          </v-chip>
        </div>
      </div>

      <!-- Ballon décoratif en arrière-plan -->
      <v-icon class="hero-ball" icon="mdi-soccer" />
    </section>

    <!-- Message affiché si l'id de ligue dans l'URL n'existe pas dans le store -->
    <v-alert v-else type="warning" variant="tonal" class="mb-6">
      Ligue introuvable pour l'id: {{ route.params.id }}
    </v-alert>

    <!-- Carte contenant les filtres et le tri -->
    <v-card class="filters-card pa-4 mb-6">

      <!-- Grille Vuetify pour placer les champs sur une ligne en desktop -->
      <v-row>

        <!-- Champ de recherche par nom du joueur -->
        <v-col cols="12" md="4">
          <v-text-field
              v-model="searchPlayer"
              label="Rechercher un joueur"
              prepend-inner-icon="mdi-account-search"
              variant="outlined"
              clearable
              hide-details
          />
        </v-col>

        <!-- Champ de recherche par nom de club -->
        <v-col cols="12" md="4">
          <v-text-field
              v-model="searchTeam"
              label="Rechercher un club"
              prepend-inner-icon="mdi-shield-search"
              variant="outlined"
              clearable
              hide-details
          />
        </v-col>

        <!-- Menu de tri -->
        <v-col cols="12" md="4">
          <v-select
              v-model="sortOption"
              label="Trier par"
              :items="[
              { title: 'Buts décroissant', value: 'goalsDesc' },
              { title: 'Buts croissant', value: 'goalsAsc' },
              { title: 'Nom A-Z', value: 'nameAsc' },
              { title: 'Nom Z-A', value: 'nameDesc' },
              { title: 'Club A-Z', value: 'teamAsc' }
            ]"
              variant="outlined"
              hide-details
          />
        </v-col>
      </v-row>
    </v-card>

    <!-- Affichage pendant le chargement de l'API -->
    <v-row v-if="playerStore.isLoading">

      <!-- On affiche 6 cartes fantômes pendant que les données chargent -->
      <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
        <v-skeleton-loader type="card" />
      </v-col>
    </v-row>

    <!-- Message d'erreur si l'API échoue et qu'aucun joueur n'est disponible -->
    <v-alert
        v-else-if="playerStore.error && allPlayers.length === 0"
        type="error"
        variant="tonal"
        class="mb-4"
    >
      {{ playerStore.error }}
    </v-alert>

    <!-- Liste des joueurs si le chargement est terminé -->
    <v-row v-else>

      <!-- Boucle sur les joueurs filtrés -->
      <v-col
          v-for="playerData in filteredPlayers"
          :key="playerData.player?.id"
          cols="12"
          sm="6"
          md="4"
      >

        <!-- Carte d'un joueur -->
        <v-card class="player-card h-100">

          <!-- Ligne rouge décorative en haut de la carte -->
          <div class="card-top-line" />

          <!-- Bouton favori -->
          <v-btn
              class="position-absolute favorite-btn"
              :icon="playerStore.isFavorite(playerData.player?.id) ? 'mdi-heart' : 'mdi-heart-outline'"
              :color="playerStore.isFavorite(playerData.player?.id) ? 'red' : 'grey'"
              variant="text"
              @click="playerStore.toggleFavorite(playerData)"
          />

          <!-- Bouton supprimer -->
          <!-- Visible seulement pour un joueur personnalisé et si l'utilisateur est connecté -->
          <v-btn
              v-if="playerData.custom && authStore.isLoggedIn"
              class="position-absolute delete-btn"
              icon="mdi-delete"
              color="red"
              variant="text"
              @click="playerStore.deleteCustomPlayer(playerData.player?.id)"
          />

          <!-- Zone image du joueur -->
          <div class="player-image-wrapper">
            <v-img
                :src="playerData.player?.photo"
                :alt="`Photo de ${playerData.player?.name || 'joueur'}`"
                max-width="145"
                contain
            >

              <!-- Image affichée si la photo du joueur ne charge pas -->
              <template #error>
                <v-img
                    src="/assets/default-player.jpg"
                    max-width="145"
                    contain
                />
              </template>
            </v-img>
          </div>

          <!-- Nom du joueur -->
          <v-card-title class="player-name">
            {{ playerData.player?.name || 'Joueur inconnu' }}
          </v-card-title>

          <!-- Club du joueur -->
          <v-card-subtitle class="player-team">
            <v-icon icon="mdi-shield" size="16" class="mr-1" />
            {{ playerData.statistics?.[0]?.team?.name || 'Équipe non disponible' }}
          </v-card-subtitle>

          <!-- Statistiques du joueur -->
          <v-card-text>

            <!-- Grille contenant buts, passes et matchs -->
            <div class="stats-grid">

              <!-- Nombre de buts -->
              <div class="stat-box">
                <span class="stat-number">
                  {{ playerData.statistics?.[0]?.goals?.total ?? 0 }}
                </span>
                <span class="stat-label">
                  Buts
                </span>
              </div>

              <!-- Nombre de passes décisives -->
              <div class="stat-box">
                <span class="stat-number">
                  {{ playerData.statistics?.[0]?.goals?.assists ?? 0 }}
                </span>
                <span class="stat-label">
                  Passes
                </span>
              </div>

              <!-- Nombre de matchs joués -->
              <div class="stat-box">
                <span class="stat-number">
                  {{ playerData.statistics?.[0]?.games?.appearences ?? 0 }}
                </span>
                <span class="stat-label">
                  Matchs
                </span>
              </div>
            </div>

            <!-- Indique si le joueur vient de l'API ou a été ajouté manuellement -->
            <div class="text-center mt-4">

              <!-- Badge joueur personnalisé -->
              <v-chip
                  v-if="playerData.custom"
                  color="primary"
                  variant="tonal"
                  size="small"
              >
                Joueur personnalisé
              </v-chip>

              <!-- Badge joueur API -->
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

      <!-- Message si aucun joueur ne correspond à la recherche -->
      <v-col v-if="filteredPlayers.length === 0" cols="12">
        <v-alert type="info" variant="tonal">
          Aucun joueur ne correspond à ta recherche.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Conteneur principal de la page */
.league-page {
  max-width: 1200px;
  padding-top: 32px;
  padding-bottom: 70px;
}

/* Grande bannière de la ligue */
.league-hero {
  position: relative;
  overflow: hidden;
  min-height: 240px;
  border-radius: 28px;
  margin-bottom: 26px;
  padding: 34px;
  background:
      linear-gradient(135deg, rgba(181, 44, 18, 0.92), rgba(18, 18, 18, 0.96)),
      url('/assets/football-bg.png');
  background-size: cover;
  background-position: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Grille décorative par-dessus la bannière */
.league-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
      linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 34px 34px;
  pointer-events: none;
}

/* Bouton retour placé au-dessus du fond */
.back-btn {
  position: relative;
  z-index: 2;
}

/* Contenu central de la bannière */
.league-hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-top: -8px;
}

/* Cadre du logo de la ligue */
.league-logo-wrapper {
  width: 115px;
  height: 115px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
}

/* Petit texte "Championnat" */
.eyebrow {
  color: #ffffff;
  opacity: 0.85;
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 2px;
  margin-bottom: 4px;
}

/* Titre de la bannière */
.league-hero h1 {
  font-size: 42px;
  font-weight: 900;
  margin-bottom: 6px;
}

/* Pays de la ligue */
.country {
  color: #eeeeee;
  margin-bottom: 16px;
}

/* Zone contenant les chips */
.hero-chips {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* Ballon décoratif */
.hero-ball {
  position: absolute;
  right: 42px;
  bottom: -28px;
  font-size: 190px;
  opacity: 0.12;
  transform: rotate(-18deg);
}

/* Carte des filtres */
.filters-card {
  border: 1px solid rgba(181, 44, 18, 0.25);
}

/* Carte joueur */
.player-card {
  position: relative;
  overflow: hidden;
  padding: 22px;
  background: linear-gradient(180deg, #202020, #191919);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Effet quand la souris passe sur une carte */
.player-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 14px 30px rgba(181, 44, 18, 0.18);
}

/* Ligne rouge en haut de la carte joueur */
.card-top-line {
  position: absolute;
  inset: 0 0 auto 0;
  height: 4px;
  background: linear-gradient(90deg, #B52C12, #ff4b3e);
}

/* Bouton favori */
.favorite-btn {
  top: 12px;
  right: 12px;
  z-index: 2;
  transition: transform 0.2s ease;
}

/* Bouton suppression */
.delete-btn {
  top: 52px;
  right: 12px;
  z-index: 2;
  transition: transform 0.2s ease;
}

/* Animation au survol des boutons */
.favorite-btn:hover,
.delete-btn:hover {
  transform: scale(1.2);
}

/* Zone image joueur */
.player-image-wrapper {
  height: 190px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Nom du joueur */
.player-name {
  text-align: center;
  font-weight: 900;
  font-size: 18px;
  padding-bottom: 4px;
}

/* Club du joueur */
.player-team {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bdbdbd;
  margin-bottom: 12px;
}

/* Grille des statistiques */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
}

/* Bloc d'une statistique */
.stat-box {
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  padding: 12px 8px;
  text-align: center;
}

/* Valeur numérique de la statistique */
.stat-number {
  display: block;
  font-size: 22px;
  font-weight: 900;
  color: #ffffff;
}

/* Label sous le nombre */
.stat-label {
  display: block;
  font-size: 12px;
  color: #bdbdbd;
}

/* Adaptation mobile */
@media (max-width: 800px) {
  .league-hero {
    padding: 24px;
  }

  .league-hero h1 {
    font-size: 32px;
  }

  .hero-ball {
    display: none;
  }

  .back-btn {
    margin-bottom: 18px;
  }
}
</style>