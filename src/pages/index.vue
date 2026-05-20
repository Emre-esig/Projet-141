<script setup>
// On importe le store Pinia principal.
// Ce store contient notamment la liste des ligues affichées sur la page d'accueil.
import { usePlayerStore } from '@/stores/playerStore'

// On importe le composant LeagueCard.
// Ce composant sert à afficher une ligue sous forme de carte.
import LeagueCard from '../components/LeagueCard.vue'

// On crée une instance du store.
// Grâce à cette variable, on peut accéder à playerStore.leagues dans le template.
const playerStore = usePlayerStore()
</script>

<template>
  <!-- Conteneur principal de la page d'accueil -->
  <v-container class="home-container">

    <!-- Section du haut de la page avec le grand titre -->
    <section class="hero-section">

      <!-- Zone contenant le texte principal -->
      <div class="hero-content">

        <!-- Petit sous-titre -->
        <p class="subtitle">
          Projet C141
        </p>

        <!-- Titre principal de l'application -->
        <h1 class="text-h2 font-weight-bold mb-4">
          TopPlayers – Elite Football Stats
        </h1>

        <!-- Description courte du projet -->
        <p class="description">
          Explore les meilleures ligues européennes, consulte les meilleurs buteurs,
          compare leurs statistiques et crée ta propre sélection de joueurs favoris.
        </p>

        <!-- Zone contenant le bouton et le compteur de ligues -->
        <div class="hero-actions">

          <!-- Bouton qui descend vers la section des ligues grâce à href="#ligues" -->
          <v-btn
              color="primary"
              size="large"
              prepend-icon="mdi-soccer"
              href="#ligues"
          >
            Voir les ligues
          </v-btn>

          <!-- Chip qui affiche le nombre de ligues disponibles dans le store -->
          <v-chip
              color="white"
              variant="flat"
              class="league-count-chip"
          >
            {{ playerStore.leagues.length }} ligues disponibles
          </v-chip>
        </div>
      </div>

      <!-- Icône ballon décorative affichée à droite du hero -->
      <div class="hero-ball">
        <v-icon icon="mdi-soccer" size="170" />
      </div>
    </section>

    <!-- Section avec trois petites cartes explicatives -->
    <section class="stats-section">

      <!-- Ligne Vuetify pour organiser les 3 cartes -->
      <v-row>

        <!-- Première carte : ligues -->
        <v-col cols="12" sm="4">
          <v-card class="stat-card pa-4 text-center">
            <v-icon icon="mdi-trophy" size="38" color="primary" />

            <h3 class="mt-2">
              Ligues
            </h3>

            <p>
              Les plus grands championnats européens
            </p>
          </v-card>
        </v-col>

        <!-- Deuxième carte : joueurs -->
        <v-col cols="12" sm="4">
          <v-card class="stat-card pa-4 text-center">
            <v-icon icon="mdi-account-star" size="38" color="primary" />

            <h3 class="mt-2">
              Joueurs
            </h3>

            <p>
              Top buteurs, passes décisives et matchs
            </p>
          </v-card>
        </v-col>

        <!-- Troisième carte : favoris -->
        <v-col cols="12" sm="4">
          <v-card class="stat-card pa-4 text-center">
            <v-icon icon="mdi-heart" size="38" color="primary" />

            <h3 class="mt-2">
              Favoris
            </h3>

            <p>
              Crée ta propre sélection de joueurs
            </p>
          </v-card>
        </v-col>
      </v-row>
    </section>

    <!-- Titre de la section des ligues -->
    <!-- L'id ligues est utilisé par le bouton "Voir les ligues" -->
    <div id="ligues" class="section-title">
      <h2>
        Choisis une ligue
      </h2>

      <p>
        Sélectionne un championnat pour afficher ses meilleurs joueurs.
      </p>
    </div>

    <!-- Grille contenant toutes les ligues -->
    <v-row class="league-grid">

      <!--
        On boucle sur toutes les ligues du store.
        Pour chaque ligue, Vue crée une colonne contenant une LeagueCard.
      -->
      <v-col
          v-for="league in playerStore.leagues"
          :key="league.id"
          cols="12"
          sm="6"
          md="4"
      >
        <!--
          On envoie la ligue actuelle au composant LeagueCard.
          Le composant enfant reçoit cette donnée avec defineProps().
        -->
        <LeagueCard :league="league" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Conteneur principal de la page */
.home-container {
  /* Largeur maximale de la page */
  max-width: 1200px;

  /* Hauteur minimum pour éviter une page trop courte */
  min-height: calc(100vh - 170px);

  /* Espace en haut */
  padding-top: 42px;

  /* Espace en bas */
  padding-bottom: 70px;
}

/* Grande section d'accueil */
.hero-section {
  /* Permet de placer des éléments décoratifs en absolute */
  position: relative;

  /* Cache ce qui dépasse du bloc arrondi */
  overflow: hidden;

  /* Coins arrondis */
  border-radius: 28px;

  /* Espace intérieur */
  padding: 56px;

  /* Espace sous la section */
  margin-bottom: 34px;

  /* Fond avec dégradé + image football */
  background:
      linear-gradient(135deg, rgba(181, 44, 18, 0.9), rgba(18, 18, 18, 0.95)),
      url('/assets/football-bg.png');

  /* L'image couvre toute la zone */
  background-size: cover;

  /* L'image est centrée */
  background-position: center;

  /* Alignement horizontal du texte et du ballon */
  display: flex;

  /* Centre verticalement */
  align-items: center;

  /* Espace entre le texte et l'icône ballon */
  justify-content: space-between;
}

/* Effet de grille légère par-dessus le hero */
.hero-section::after {
  /* Obligatoire pour afficher un pseudo-élément */
  content: "";

  /* Positionné par-dessus toute la section */
  position: absolute;

  /* Prend toute la place */
  inset: 0;

  /* Deux gradients pour créer une grille */
  background-image:
      linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);

  /* Taille des carrés de la grille */
  background-size: 32px 32px;

  /* Empêche la grille de bloquer les clics */
  pointer-events: none;
}

/* Contenu texte du hero */
.hero-content {
  /* Permet de passer au-dessus de l'effet ::after */
  position: relative;

  /* Met le contenu au-dessus de la grille */
  z-index: 1;

  /* Limite la largeur du texte */
  max-width: 720px;
}

/* Petit texte "Projet C141" */
.subtitle {
  color: #ffffff;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

/* Description du hero */
.description {
  max-width: 720px;
  color: #eeeeee;
  font-size: 17px;
  line-height: 1.7;
  margin-bottom: 0;
}

/* Zone du bouton et du chip */
.hero-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 28px;
  flex-wrap: wrap;
}

/* Icône ballon décorative */
.hero-ball {
  position: relative;
  z-index: 1;
  opacity: 0.18;
  transform: rotate(-18deg);
}

/* Section des trois cartes */
.stats-section {
  margin-bottom: 38px;
}

/* Style des petites cartes */
.stat-card {
  height: 100%;
  border: 1px solid rgba(181, 44, 18, 0.25);
}

/* Texte dans les cartes */
.stat-card p {
  color: #bdbdbd;
  margin-bottom: 0;
}

/* Bloc titre avant les ligues */
.section-title {
  margin-bottom: 22px;
}

/* Titre "Choisis une ligue" */
.section-title h2 {
  font-size: 30px;
  font-weight: 800;
  margin-bottom: 6px;
}

/* Description sous le titre */
.section-title p {
  color: #bdbdbd;
  margin-bottom: 0;
}

/* Grille des ligues */
.league-grid {
  margin-top: 8px;
}

/* Chip blanc contenant le nombre de ligues */
.league-count-chip {
  color: #B52C12 !important;
  font-weight: 800;
}

/* Adaptation pour les petits écrans */
@media (max-width: 800px) {
  /* Réduit l'espace intérieur du hero sur mobile */
  .hero-section {
    padding: 32px;
  }

  /* Cache l'icône ballon sur mobile */
  .hero-ball {
    display: none;
  }

  /* Réduit la taille du titre sur mobile */
  .hero-section h1 {
    font-size: 34px !important;
  }
}
</style>