import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#121212',
          surface: '#1E1E1E',
          primary: '#B52C12',
          secondary: '#FFFFFF',
          accent: '#000000',
          error: '#E63946',
          info: '#44CFCB',
          success: '#97CE4C',
          warning: '#FFA724'
        }
      }
    }
  },
  defaults: {
    VCard: {
      rounded: 'lg',
      elevation: 3
    },
    VBtn: {
      rounded: 'lg'
    },
    VTextField: {
      density: 'comfortable'
    },
    VSelect: {
      density: 'comfortable'
    }
  }
})