<script setup>
// defineProps permet de recevoir des données depuis le parent
defineProps({
  league: Object
})
</script>

<template>
  <!-- Carte cliquable vers la page detail -->
  <v-card class="pa-4 h-100" :to="`/league/${league.id}`">
    <!--
      On utilise un <img> simple pour garantir l'affichage du logo.
      (plus fiable ici que v-img dans ton cas)
    -->
    <img
        :src="league.logo"
        :alt="`Logo ${league.name}`"
        style="height: 120px; width: 100%; object-fit: contain; display: block;"
    />

    <v-card-title>
      {{ league.name }}
    </v-card-title>

    <v-card-subtitle>
      {{ league.country }}
    </v-card-subtitle>
  </v-card>
</template>
