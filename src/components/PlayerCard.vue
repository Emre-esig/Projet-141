<script setup>
defineProps({
  playerData: Object
})
</script>

<template>
  <v-card class="pa-4 h-100">
    <v-img
        :src="playerData.player.photo"
        height="180"
        cover
    />

    <v-card-title>
      {{ playerData.player.name }}
    </v-card-title>

    <v-card-subtitle>
      {{ playerData.statistics[0].team.name }}
    </v-card-subtitle>

    <v-card-text>
      <div>Matchs : {{ playerData.statistics[0].games.appearences || 0 }}</div>
      <div>Buts : {{ playerData.statistics[0].goals.total || 0 }}</div>
      <div>Passes : {{ playerData.statistics[0].goals.assists || 0 }}</div>
      <div>Minutes : {{ playerData.statistics[0].games.minutes || 0 }}</div>
    </v-card-text>
  </v-card>
</template>