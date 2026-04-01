import { defineStore } from 'pinia'

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
            }
        ],
        topScorersByLeague: {},
        loading: false,
        error: null
    }),

    getters: {
        getLeagueById: (state) => {
            return (leagueId) =>
                state.leagues.find(league => league.id === Number(leagueId))
        },

        getTopScorersByLeague: (state) => {
            return (leagueId) => state.topScorersByLeague[leagueId] || []
        }
    },

    actions: {
        async fetchTopScorersByLeague(leagueId) {
            if (this.topScorersByLeague[leagueId]) {
                return
            }

            this.loading = true
            this.error = null

            try {
                const response = await fetch(
                    `https://v3.football.api-sports.io/players/topscorers?league=${leagueId}&season=2023`,
                    {
                        headers: {
                            'x-apisports-key': '12e804a9f1d0a2b8a9da6f1951f992a2'
                        }
                    }
                )

                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des joueurs')
                }

                const data = await response.json()
                this.topScorersByLeague[leagueId] = data.response.slice(0, 10)
            } catch (err) {
                this.error = 'Erreur lors du chargement des joueurs'
                console.error(err)
            } finally {
                this.loading = false
            }
        },

        init() {
            this.error = null
        }
    }
})