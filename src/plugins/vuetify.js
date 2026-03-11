import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#B52C12',    // Bleu turquoise (portail, logo R&M)
          secondary: '#FFFFFF',  // Blanc
          accent: '#000000',     // Noir
          error: '#E63946',      // Rouge (lasers, danger)
          info: '#44CFCB',       // Cyan clair
          success: '#97CE4C',    // Vert (même que secondary)
          warning: '#FFA724',    // Orange
        },
      },
    },
  },
})