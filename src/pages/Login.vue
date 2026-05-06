<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref(null)
const email = ref('')
const password = ref('')
const snackbar = ref(false)
const message = ref('')
const color = ref('success')

const rules = {
  required: value => !!value || 'Champ obligatoire'
}

const login = async () => {
  const resultValidation = await form.value.validate()

  if (!resultValidation.valid) {
    return
  }

  const result = authStore.login(email.value, password.value)

  message.value = result.message
  color.value = result.success ? 'success' : 'error'
  snackbar.value = true

  if (result.success) {
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  }
}
</script>

<template>
  <v-container class="login-container">
    <v-card class="pa-6 mx-auto" max-width="500">
      <h1 class="text-h4 text-center mb-6">
        Connexion
      </h1>

      <v-form ref="form" @submit.prevent="login">
        <v-text-field
            v-model="email"
            label="Email"
            type="email"
            prepend-inner-icon="mdi-email"
            variant="outlined"
            :rules="[rules.required]"
            class="mb-3"
        />

        <v-text-field
            v-model="password"
            label="Mot de passe"
            type="password"
            prepend-inner-icon="mdi-lock"
            variant="outlined"
            :rules="[rules.required]"
            class="mb-4"
        />

        <v-btn
            type="submit"
            color="primary"
            block
            size="large"
        >
          Se connecter
        </v-btn>
      </v-form>

      <v-alert type="info" variant="tonal" class="mt-6">
        Email : admin@football.ch<br>
        Mot de passe : 1234
      </v-alert>
    </v-card>

    <v-snackbar v-model="snackbar" :color="color">
      {{ message }}
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.login-container {
  min-height: calc(100vh - 170px);
  display: flex;
  align-items: center;
}
</style>