/**
 * main.js
 * Point de départ de l'application
 */

// On importe les plugins (Vuetify, router, etc.)
import { registerPlugins } from '@/plugins'

// On importe le composant principal
import App from './App.vue'

// Fonction pour créer l'application Vue
import { createApp } from 'vue'

// Pinia (gestion d'état global)
import { createPinia } from 'pinia'

// On crée l'application
const app = createApp(App)

// On active Pinia (TRÈS IMPORTANT sinon ça ne marche pas)
app.use(createPinia())

// On enregistre les autres plugins (router, vuetify...)
registerPlugins(app)

// On monte l'application dans le HTML (#app)
app.mount('#app')