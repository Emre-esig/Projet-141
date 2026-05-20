<script setup>
// computed : permet de créer des valeurs calculées automatiquement.
// onMounted : permet d'exécuter du code quand la page est chargée.
// ref : permet de créer des variables réactives simples.
import { computed, onMounted, ref } from 'vue'

// Import du store principal.
// Ce store contient les favoris, les joueurs, les fonctions de suppression, etc.
import { usePlayerStore } from '@/stores/playerStore'

// On récupère le store Pinia pour pouvoir utiliser ses données et ses actions.
const playerStore = usePlayerStore()

// Contrôle l'ouverture de la fenêtre de confirmation.
// false = fenêtre fermée
// true = fenêtre ouverte
const dialog = ref(false)

// Contient le joueur sélectionné avant suppression.
// Au départ, aucun joueur n'est sélectionné, donc null.
const selectedPlayer = ref(null)

// Contrôle l'affichage de la notification en bas de page.
const snackbar = ref(false)

// Calcule le total des buts de tous les joueurs favoris.
// computed se met automatiquement à jour si favoritePlayers change.
const totalGoals = computed(() => {
  return playerStore.favoritePlayers.reduce((total, playerData) => {
    return total + (playerData.statistics?.[0]?.goals?.total ?? 0)
  }, 0)
})

// Calcule le total des passes décisives de tous les joueurs favoris.
const totalAssists = computed(() => {
  return playerStore.favoritePlayers.reduce((total, playerData) => {
    return total + (playerData.statistics?.[0]?.goals?.assists ?? 0)
  }, 0)
})

// Quand la page Favoris est affichée,
// on recharge les favoris depuis le localStorage grâce au store.
onMounted(() => {
  playerStore.loadFavorites()
})

// Fonction appelée quand on clique sur l'icône poubelle.
// Elle prépare la suppression, mais ne supprime pas encore.
const openDeleteDialog = (playerData) => {
  // On garde en mémoire le joueur à supprimer.
  selectedPlayer.value = playerData

  // On ouvre la popup de confirmation.
  dialog.value = true
}

// Fonction appelée quand l'utilisateur confirme la suppression.
const confirmDelete = () => {
  // On vérifie qu'un joueur est bien sélectionné.
  if (selectedPlayer.value) {
    // On supprime le joueur des favoris via le store.
    playerStore.deleteFavorite(selectedPlayer.value.player?.id)

    // On affiche une notification de succès.
    snackbar.value = true
  }

  // On ferme la popup.
  dialog.value = false

  // On vide le joueur sélectionné.
  selectedPlayer.value = null
}
</script>

<template>
  <!-- Conteneur principal de la page favoris -->
  <v-container class="favorites-page">

    <!-- Grande bannière en haut de la page -->
    <section class="favorites-hero">

      <!-- Contenu texte de la bannière -->
      <div class="hero-content">

        <!-- Petit sous-titre -->
        <p class="eyebrow">
          Sélection personnelle
        </p>

        <!-- Titre principal -->
        <h1>
          Mes favoris
        </h1>

        <!-- Description courte -->
        <p class="description">
          Retrouve ici les joueurs que tu as sélectionnés parmi les différentes ligues.
        </p>

        <!-- Zone contenant les statistiques globales des favoris -->
        <div class="hero-stats">

          <!-- Nombre total de favoris -->
          <v-chip color="primary" variant="flat">
            {{ playerStore.favoritePlayers.length }} favoris
          </v-chip>

          <!-- Total des buts des favoris -->
          <v-chip color="info" variant="tonal">
            {{ totalGoals }} buts
          </v-chip>

          <!-- Total des passes décisives des favoris -->
          <v-chip color="success" variant="tonal">
            {{ totalAssists }} passes
          </v-chip>
        </div>
      </div>

      <!-- Icône cœur décorative dans la bannière -->
      <v-icon class="hero-icon" icon="mdi-heart"/>
    </section>

    <!-- Message affiché si aucun joueur n'est en favori -->
    <v-alert
        v-if="playerStore.favoritePlayers.length === 0"
        type="info"
        variant="tonal"
        class="mb-6"
    >
      Aucun joueur favori pour le moment.
    </v-alert>

    <!-- Grille affichée seulement s'il y a au moins un favori -->
    <v-row v-else>

      <!-- Boucle sur tous les joueurs favoris -->
      <v-col
          v-for="playerData in playerStore.favoritePlayers"
          :key="playerData.player?.id"
          cols="12"
          sm="6"
          md="4"
      >

        <!-- Carte d'un joueur favori -->
        <v-card class="player-card h-100">

          <!-- Ligne rouge décorative en haut de la carte -->
          <div class="card-top-line"/>

          <!-- Bouton de suppression du favori -->
          <v-btn
              class="position-absolute delete-btn"
              icon="mdi-delete"
              color="red"
              variant="text"
              @click="openDeleteDialog(playerData)"
          />

          <!-- Zone contenant l'image du joueur -->
          <div class="player-image-wrapper">
            <v-img
                :src="playerData.player?.photo"
                :alt="`Photo de ${playerData.player?.name || 'joueur'}`"
                max-width="145"
                contain
            >

              <!-- Image de secours si la photo ne charge pas -->
              <template #error>
                <v-img
                    src="/default-player.jpg"
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

          <!-- Équipe du joueur -->
          <v-card-subtitle class="player-team">
            <v-icon icon="mdi-shield" size="16" class="mr-1"/>
            {{ playerData.statistics?.[0]?.team?.name || 'Équipe non disponible' }}
          </v-card-subtitle>

          <!-- Contenu de la carte avec les statistiques -->
          <v-card-text>

            <!-- Grille des statistiques -->
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

            <!-- Indication de la source du joueur -->
            <div class="text-center mt-4">

              <!-- Badge si le joueur a été ajouté manuellement -->
              <v-chip
                  v-if="playerData.custom"
                  color="primary"
                  variant="tonal"
                  size="small"
              >
                Joueur personnalisé
              </v-chip>

              <!-- Badge si le joueur vient de l'API -->
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

    <!-- Popup de confirmation avant suppression -->
    <v-dialog v-model="dialog" max-width="500">

      <!-- Carte de confirmation -->
      <v-card class="confirm-card">

        <!-- Titre de la popup -->
        <v-card-title class="text-h5">
          Confirmer la suppression
        </v-card-title>

        <!-- Texte de confirmation -->
        <v-card-text>
          Veux-tu vraiment supprimer
          <strong>{{ selectedPlayer?.player?.name }}</strong>
          de tes favoris ?
        </v-card-text>

        <!-- Boutons de la popup -->
        <v-card-actions>

          <!-- Pousse les boutons vers la droite -->
          <v-spacer/>

          <!-- Annule la suppression et ferme la popup -->
          <v-btn variant="text" @click="dialog = false">
            Annuler
          </v-btn>

          <!-- Confirme la suppression -->
          <v-btn color="red" variant="flat" @click="confirmDelete">
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Notification affichée après suppression -->
    <v-snackbar v-model="snackbar" color="success">
      Joueur supprimé des favoris.
    </v-snackbar>
  </v-container>
</template>

<style scoped>
/* Conteneur principal de la page */
.favorites-page {
  max-width: 1200px;
  padding-top: 32px;
  padding-bottom: 70px;
}

/* Bannière principale de la page favoris */
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

/* Grille décorative par-dessus la bannière */
.favorites-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 34px 34px;
  pointer-events: none;
}

/* Contenu texte de la bannière */
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 720px;
}

/* Petit texte au-dessus du titre */
.eyebrow {
  color: #ffffff;
  opacity: 0.85;
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

/* Titre Mes favoris */
.favorites-hero h1 {
  font-size: 46px;
  font-weight: 900;
  margin-bottom: 10px;
}

/* Description dans la bannière */
.description {
  color: #eeeeee;
  font-size: 17px;
  line-height: 1.6;
  margin-bottom: 0;
}

/* Zone contenant les chips statistiques */
.hero-stats {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 22px;
}

/* Grande icône cœur décorative */
.hero-icon {
  position: absolute;
  right: 46px;
  bottom: -20px;
  font-size: 180px;
  opacity: 0.12;
  transform: rotate(-12deg);
}

/* Carte d'un joueur favori */
.player-card {
  position: relative;
  overflow: hidden;
  padding: 22px;
  background: linear-gradient(180deg, #202020, #191919);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Animation au survol de la carte */
.player-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 14px 30px rgba(181, 44, 18, 0.18);
}

/* Ligne décorative rouge en haut de la carte */
.card-top-line {
  position: absolute;
  inset: 0 0 auto 0;
  height: 4px;
  background: linear-gradient(90deg, #B52C12, #ff4b3e);
}

/* Bouton supprimer */
.delete-btn {
  top: 12px;
  right: 12px;
  z-index: 2;
  transition: transform 0.2s ease;
}

/* Animation du bouton supprimer au survol */
.delete-btn:hover {
  transform: scale(1.2);
}

/* Zone qui centre l'image du joueur */
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

/* Ligne affichant l'équipe */
.player-team {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bdbdbd;
  margin-bottom: 12px;
}

/* Grille des statistiques joueur */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
}

/* Bloc individuel d'une statistique */
.stat-box {
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  padding: 12px 8px;
  text-align: center;
}

/* Valeur numérique : buts, passes, matchs */
.stat-number {
  display: block;
  font-size: 22px;
  font-weight: 900;
  color: #ffffff;
}

/* Texte sous le nombre */
.stat-label {
  display: block;
  font-size: 12px;
  color: #bdbdbd;
}

/* Carte de confirmation de suppression */
.confirm-card {
  border-top: 4px solid #B52C12;
}

/* Responsive mobile */
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