<script setup>
// On reçoit les données d’un joueur depuis le parent
defineProps({
  playerData: Object
})
</script>

<template>
  <!-- Carte joueur -->
  <v-card class="pa-4 h-100">

    <!-- Photo du joueur -->
    <v-img
        :src="playerData.player.photo"
        height="180"
        cover
    />

    <!-- Nom du joueur -->
    <v-card-title>
      {{ playerData.player.name }}
    </v-card-title>

    <!-- Nom de l'équipe -->
    <v-card-subtitle>
      {{ playerData.statistics[0].team.name }}
    </v-card-subtitle>

    <!-- Statistiques -->
    <v-card-text>

      <!-- Matchs joués -->
      <div>
        Matchs : {{ playerData.statistics[0].games.appearances || 0 }}
      </div>

      <!-- Buts -->
      <div>
        Buts : {{ playerData.statistics[0].goals.total || 0 }}
      </div>

      <!-- Passes décisives -->
      <div>
        Passes : {{ playerData.statistics[0].goals.assists || 0 }}
      </div>

      <!-- Minutes jouées -->
      <div>
        Minutes : {{ playerData.statistics[0].games.minutes || 0 }}
      </div>

    </v-card-text>
  </v-card>
</template>