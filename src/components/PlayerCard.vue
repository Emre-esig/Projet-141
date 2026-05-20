<script setup>

// =====================================================
// PlayerCard.vue
//
// Ce composant affiche les informations
// d’un joueur sous forme de carte.
//
// Il est utilisé pour afficher :
// - les joueurs API
// - les joueurs favoris
// - les joueurs personnalisés
// =====================================================

// =====================================================
// DEFINE PROPS
// =====================================================

/*
  defineProps()

  permet de recevoir des données
  depuis le composant parent.
*/

/*
  Exemple :

  <PlayerCard :playerData="player" />
*/
defineProps({

  // Objet contenant toutes les données du joueur
  playerData: Object
})
</script>

<template>

  <!-- ==========================================
       CARTE JOUEUR
  ========================================== -->

  <v-card class="pa-4 h-100">

    <!-- ==========================================
         PHOTO JOUEUR
    ========================================== -->

    <!--
      v-img :

      composant image Vuetify.
    -->

    <!--
      playerData.player.photo

      URL image joueur venant de l'API.
    -->
    <v-img
        :src="playerData.player.photo"
        height="180"
        cover
    />
    <!-- ==========================================
         NOM JOUEUR
    ========================================== -->

    <v-card-title>

      <!-- Exemple : Mohamed Salah -->
      {{ playerData.player.name }}

    </v-card-title>
    <!-- ==========================================
         NOM EQUIPE
    ========================================== -->

    <v-card-subtitle>

      <!-- Exemple : Liverpool -->
      {{ playerData.statistics[0].team.name }}

    </v-card-subtitle>
    <!-- ==========================================
         STATISTIQUES
    ========================================== -->

    <v-card-text>
      <!-- ==========================================
           MATCHS JOUES
      ========================================== -->

      <div>

        <!--
          || 0

          si la valeur n'existe pas,
          affiche 0.
        -->
        Matchs :
        {{ playerData.statistics[0].games.appearances || 0 }}

      </div>

      <!-- ==========================================
           BUTS
      ========================================== -->

      <div>

        Buts :
        {{ playerData.statistics[0].goals.total || 0 }}

      </div>

      <!-- ==========================================
           PASSES DECISIVES
      ========================================== -->

      <div>

        Passes :
        {{ playerData.statistics[0].goals.assists || 0 }}

      </div>

      <!-- ==========================================
           MINUTES JOUEES
      ========================================== -->

      <div>

        Minutes :
        {{ playerData.statistics[0].games.minutes || 0 }}

      </div>

    </v-card-text>
  </v-card>
</template>