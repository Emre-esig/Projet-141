<script setup>
defineProps({
  league: Object
})
</script>

<template>
  <v-card
      class="pa-4 h-100"
      :to="`/league/${league.id}`"
  >
    <v-img
        :src="league.logo"
        height="120"
        contain
    />

    <v-card-title>
      {{ league.name }}
    </v-card-title>

    <v-card-subtitle>
      {{ league.country }}
    </v-card-subtitle>
  </v-card>
</template>