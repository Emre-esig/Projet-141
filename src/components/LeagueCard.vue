<script setup>
// Ce composant reçoit une ligue depuis index.vue.
// Exemple dans index.vue : <LeagueCard :league="league" />
defineProps({
  // Objet ligue contenant id, name, country et logo
  league: Object
})
</script>

<template>
  <!-- Carte cliquable vers la page détail de la ligue -->
  <v-card class="pa-4 h-100" :to="`/league/${league.id}`">
    <!-- Logo de la ligue -->
    <img
        :src="league.logo"
        :alt="`Logo ${league.name}`"
        style="height: 120px; width: 100%; object-fit: contain; display: block;"
    />

    <!-- Nom de la ligue -->
    <v-card-title>
      {{ league.name }}
    </v-card-title>

    <!-- Pays de la ligue -->
    <v-card-subtitle>
      {{ league.country }}
    </v-card-subtitle>
  </v-card>
</template>