import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null
    }),

    getters: {
        isLoggedIn: (state) => state.user !== null
    },

    actions: {
        login(email, password) {
            if (email === 'admin@football.ch' && password === '1234') {
                this.user = {
                    email: email,
                    name: 'Admin'
                }

                localStorage.setItem('user', JSON.stringify(this.user))

                return {
                    success: true,
                    message: 'Connexion réussie.'
                }
            }

            return {
                success: false,
                message: 'Email ou mot de passe incorrect.'
            }
        },

        logout() {
            this.user = null
            localStorage.removeItem('user')
        }
    }
})