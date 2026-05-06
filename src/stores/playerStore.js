import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const usePlayerStore = defineStore('player', {
    state: () => ({
        leagues: [
            {
                id: 39,
                name: 'Premier League',
                country: 'Angleterre',
                logo: 'https://media.api-sports.io/football/leagues/39.png'
            },
            {
                id: 140,
                name: 'La Liga',
                country: 'Espagne',
                logo: 'https://media.api-sports.io/football/leagues/140.png'
            },
            {
                id: 61,
                name: 'Ligue 1',
                country: 'France',
                logo: 'https://media.api-sports.io/football/leagues/61.png'
            },
            {
                id: 78,
                name: 'Bundesliga',
                country: 'Allemagne',
                logo: 'https://media.api-sports.io/football/leagues/78.png'
            },
            {
                id: 135,
                name: 'Serie A',
                country: 'Italie',
                logo: 'https://media.api-sports.io/football/leagues/135.png'
            },
            {
                id: 203,
                name: 'Süper Lig',
                country: 'Turquie',
                logo: 'https://media.api-sports.io/football/leagues/203.png'
            },
            {
                id: 107,
                name: 'Eredivisie',
                country: 'Pays-Bas',
                logo: 'https://media.api-sports.io/football/leagues/107.png'
            },
            {
                id: 550,
                name: 'Primeira Liga',
                country: 'Portugal',
                logo: 'https://media.api-sports.io/football/leagues/550.png'
            },
            {
                id: 207,
                name: 'Super League',
                country: 'Suisse',
                logo: 'https://media.api-sports.io/football/leagues/207.png'
            }
        ],

        players: [],
        favoritePlayers: [],
        isLoading: false,
        error: null
    }),

    getters: {
        getLeagueById: (state) => (leagueId) => {
            return state.leagues.find(league => league.id === Number(leagueId))
        },

        isFavorite: (state) => (playerId) => {
            return state.favoritePlayers.some(playerData => playerData.player?.id === playerId)
        },

        totalFavorites: (state) => {
            return state.favoritePlayers.length
        }
    },

    actions: {
        async fetchTopPlayersByLeague(leagueId) {
            this.isLoading = true
            this.error = null

            try {
                const response = await api.get('/players/topscorers', {
                    params: {
                        league: leagueId,
                        season: 2024
                    }
                })

                this.players = response.data.response
                this.loadFavorites()
            } catch (error) {
                console.error('Erreur API :', error)
                this.players = []
                this.error = 'Impossible de charger les joueurs.'
            } finally {
                this.isLoading = false
            }
        },

        toggleFavorite(playerData) {
            const index = this.favoritePlayers.findIndex(favorite =>
                favorite.player?.id === playerData.player?.id
            )

            if (index === -1) {
                this.favoritePlayers.push(playerData)
            } else {
                this.favoritePlayers.splice(index, 1)
            }

            this.saveFavorites()
        },

        saveFavorites() {
            localStorage.setItem('favoritePlayers', JSON.stringify(this.favoritePlayers))
        },

        loadFavorites() {
            const savedFavorites = localStorage.getItem('favoritePlayers')

            if (savedFavorites) {
                this.favoritePlayers = JSON.parse(savedFavorites)
            }
        },
        addCustomPlayer(playerData) {
            if (!playerData.name || !playerData.team) {
                return {
                    success: false,
                    message: 'Le nom du joueur et l’équipe sont obligatoires.'
                }
            }

            const newPlayer = {
                player: {
                    id: Date.now(),
                    name: playerData.name,
                    photo: playerData.photo || 'https://via.placeholder.com/150'
                },
                statistics: [
                    {
                        team: {
                            name: playerData.team
                        },
                        goals: {
                            total: Number(playerData.goals) || 0,
                            assists: Number(playerData.assists) || 0
                        },
                        games: {
                            appearences: Number(playerData.appearances) || 0
                        }
                    }
                ],
                custom: true
            }

            this.favoritePlayers.push(newPlayer)
            this.saveFavorites()

            return {
                success: true,
                message: 'Joueur ajouté aux favoris avec succès.'
            }
        },

        deleteFavorite(playerId) {
            this.favoritePlayers = this.favoritePlayers.filter(playerData =>
                playerData.player?.id !== playerId
            )

            this.saveFavorites()
        }
    }
})