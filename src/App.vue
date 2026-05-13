<template>
  <v-app>
    <v-app-bar color="primary" height="70" flat>
      <v-app-bar-nav-icon
          class="d-md-none"
          @click="drawer = !drawer"
      />

      <div class="d-flex align-center ml-2 ml-md-4">
        <v-img
            src="/cr7-logo-png-transparent.png"
            width="45"
            height="45"
            class="mr-3"
        />

        <div class="d-flex flex-column">
          <span class="text-h6 font-weight-bold">
            Football API
          </span>
          <span class="text-caption">
            Projet C141
          </span>
        </div>
      </div>

      <v-spacer />

      <div class="mr-4 d-none d-md-flex align-center">
        <v-btn to="/" variant="text">Accueil</v-btn>
        <v-btn to="/favoris" variant="text">Favoris</v-btn>
        <v-btn
            v-if="authStore.isLoggedIn"
            to="/ajouter"
            variant="text"
        >
          Ajouter
        </v-btn>

        <v-btn
            v-if="!authStore.isLoggedIn"
            to="/login"
            variant="outlined"
            class="ml-2"
        >
          Connexion
        </v-btn>

        <v-btn
            v-else
            variant="outlined"
            class="ml-2"
            @click="logout"
        >
          Déconnexion
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        temporary
        class="d-md-none"
    >
      <v-list nav>
        <v-list-item
            prepend-icon="mdi-home"
            title="Accueil"
            to="/"
            @click="drawer = false"
        />

        <v-list-item
            prepend-icon="mdi-heart"
            title="Favoris"
            to="/favoris"
            @click="drawer = false"
        />

        <v-list-item
            v-if="authStore.isLoggedIn"
            prepend-icon="mdi-plus"
            title="Ajouter"
            to="/ajouter"
            @click="drawer = false"
        />

        <v-divider class="my-2" />

        <v-list-item
            v-if="!authStore.isLoggedIn"
            prepend-icon="mdi-login"
            title="Connexion"
            to="/login"
            @click="drawer = false"
        />

        <v-list-item
            v-else
            prepend-icon="mdi-logout"
            title="Déconnexion"
            @click="logoutMobile"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <RouterView />
    </v-main>

    <v-footer class="text-center">
      <v-col>
        Projet C141 - Emre-Esig {{ currentYear }} -
        API
        <a
            href="https://dashboard.api-football.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary"
        >
          api-football.com
        </a>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const currentYear = new Date().getFullYear()
const router = useRouter()
const authStore = useAuthStore()
const drawer = ref(false)

const logout = () => {
  authStore.logout()
  router.push('/')
}

const logoutMobile = () => {
  drawer.value = false
  logout()
}
</script>