// defineStore permet de créer un store Pinia.
// Un store sert à centraliser des données utilisées dans plusieurs pages.
import { defineStore } from 'pinia'

// api est l'instance Axios configurée dans src/plugins/axios.js.
// Elle contient déjà l'URL de base de l'API et la clé API.
import api from '@/plugins/axios'

// Image utilisée quand un joueur personnalisé n'a pas de photo.
const DEFAULT_PLAYER_IMAGE = '/default-player.jpg'

// Création du store Pinia appelé "player".
// Dans les composants, on l'utilise avec usePlayerStore().
export const usePlayerStore = defineStore('player', {
    state: () => ({
        // Liste fixe des ligues affichées sur la page d'accueil.
        // Chaque ligue contient :
        // - id : identifiant utilisé par API-Football
        // - name : nom de la ligue
        // - country : pays
        // - logo : image de la ligue
        leagues: [
            { id: 39, name: 'Premier League', country: 'Angleterre', logo: 'https://media.api-sports.io/football/leagues/39.png' },
            { id: 140, name: 'La Liga', country: 'Espagne', logo: 'https://media.api-sports.io/football/leagues/140.png' },
            { id: 61, name: 'Ligue 1', country: 'France', logo: 'https://media.api-sports.io/football/leagues/61.png' },
            { id: 78, name: 'Bundesliga', country: 'Allemagne', logo: 'https://media.api-sports.io/football/leagues/78.png' },
            { id: 135, name: 'Serie A', country: 'Italie', logo: 'https://media.api-sports.io/football/leagues/135.png' },
            { id: 203, name: 'Süper Lig', country: 'Turquie', logo: 'https://media.api-sports.io/football/leagues/203.png' },
            { id: 107, name: 'Eredivisie', country: 'Pays-Bas', logo: 'https://media.api-sports.io/football/leagues/107.png' },
            { id: 550, name: 'Primeira Liga', country: 'Portugal', logo: 'https://media.api-sports.io/football/leagues/550.png' },
            { id: 207, name: 'Super League', country: 'Suisse', logo: 'https://media.api-sports.io/football/leagues/207.png' }
        ],

        // Joueurs récupérés depuis l'API Football.
        players: [],

        // Joueurs ajoutés manuellement par l'utilisateur.
        customPlayers: [],

        // Joueurs ajoutés dans les favoris.
        favoritePlayers: [],

        // Équipes récupérées depuis l'API pour la page AjouterJoueur.
        teams: [],

        // Indique si les joueurs sont en cours de chargement.
        isLoading: false,

        // Indique si les équipes sont en cours de chargement.
        isLoadingTeams: false,

        // Message d'erreur si l'appel API échoue.
        error: null
    }),

    getters: {
        // Retrouve une ligue grâce à son id.
        getLeagueById: (state) => (leagueId) => {
            return state.leagues.find(league => league.id === Number(leagueId))
        },

        // Retourne seulement les joueurs personnalisés d'une ligue précise.
        getCustomPlayersByLeague: (state) => (leagueId) => {
            return state.customPlayers.filter(playerData =>
                playerData.leagueId === Number(leagueId)
            )
        },

        // Vérifie si un joueur est déjà dans les favoris.
        isFavorite: (state) => (playerId) => {
            return state.favoritePlayers.some(playerData =>
                playerData.player?.id === playerId
            )
        },

        // Retourne le nombre total de joueurs favoris.
        totalFavorites: (state) => {
            return state.favoritePlayers.length
        }
    },

    actions: {
        // Charge les meilleurs buteurs d'une ligue depuis l'API Football.
        async fetchTopPlayersByLeague(leagueId) {
            // Active le chargement.
            this.isLoading = true

            // Réinitialise l'erreur précédente.
            this.error = null

            // Recharge les favoris sauvegardés dans le navigateur.
            this.loadFavorites()

            // Recharge les joueurs personnalisés sauvegardés.
            this.loadCustomPlayers()

            try {
                // Requête API vers :
                // https://v3.football.api-sports.io/players/topscorers
                const response = await api.get('/players/topscorers', {
                    params: {
                        league: leagueId,
                        season: 2024
                    }
                })

                // Stocke la réponse API dans le state.
                this.players = response.data.response
            } catch (error) {
                // Affiche l'erreur dans la console.
                console.error('Erreur API :', error)

                // Vide les joueurs si l'API échoue.
                this.players = []

                // Message affichable dans l'interface.
                this.error = 'Impossible de charger les joueurs.'
            } finally {
                // Désactive le chargement dans tous les cas.
                this.isLoading = false
            }
        },

        // Charge les équipes d'une ligue depuis l'API Football.
        async fetchTeamsByLeague(leagueId) {
            // Active le chargement des équipes.
            this.isLoadingTeams = true

            // Vide l'ancienne liste d'équipes.
            this.teams = []

            try {
                // Requête API vers /teams.
                const response = await api.get('/teams', {
                    params: {
                        league: leagueId,
                        season: 2024
                    }
                })

                // On transforme la réponse API.
                // On garde seulement id, name et logo.
                this.teams = response.data.response.map(item => ({
                    id: item.team.id,
                    name: item.team.name,
                    logo: item.team.logo
                }))
            } catch (error) {
                // Affiche l'erreur dans la console.
                console.error('Erreur API équipes :', error)

                // Vide la liste en cas d'erreur.
                this.teams = []
            } finally {
                // Désactive le chargement.
                this.isLoadingTeams = false
            }
        },

        // Ajoute un joueur créé manuellement par l'utilisateur.
        addCustomPlayer(playerData) {
            // Vérifie les champs obligatoires.
            if (!playerData.name || !playerData.team || !playerData.leagueId) {
                return {
                    success: false,
                    message: 'Le nom du joueur, l’équipe et la ligue sont obligatoires.'
                }
            }

            // Cherche l'équipe sélectionnée dans la liste des équipes chargées.
            const selectedTeam = this.teams.find(team => team.name === playerData.team)

            // Création d'un objet joueur au même format que les joueurs API.
            const newPlayer = {
                // Id de la ligue liée au joueur personnalisé.
                leagueId: Number(playerData.leagueId),

                // Indique que ce joueur ne vient pas de l'API.
                custom: true,

                // Informations principales du joueur.
                player: {
                    // Date.now() crée un id unique basé sur l'heure actuelle.
                    id: Date.now(),

                    // trim() enlève les espaces au début et à la fin.
                    name: playerData.name.trim(),

                    // Si une photo est fournie, on l'utilise.
                    // Sinon, on utilise l'image par défaut.
                    photo: playerData.photo?.trim()
                        ? playerData.photo.trim()
                        : DEFAULT_PLAYER_IMAGE
                },

                // Tableau statistics pour imiter la structure de l'API Football.
                statistics: [
                    {
                        team: {
                            id: selectedTeam?.id || null,
                            name: playerData.team.trim(),
                            logo: selectedTeam?.logo || null
                        },
                        goals: {
                            total: Number(playerData.goals) || 0,
                            assists: Number(playerData.assists) || 0
                        },
                        games: {
                            appearences: Number(playerData.appearances) || 0
                        }
                    }
                ]
            }

            // Ajoute le joueur personnalisé dans le state.
            this.customPlayers.push(newPlayer)

            // Sauvegarde les joueurs personnalisés dans localStorage.
            this.saveCustomPlayers()

            // Retour utilisé par AjouterJoueur.vue pour afficher une notification.
            return {
                success: true,
                message: 'Joueur ajouté dans la ligue avec succès.'
            }
        },

        // Supprime un joueur personnalisé.
        deleteCustomPlayer(playerId) {
            // Retire le joueur de customPlayers.
            this.customPlayers = this.customPlayers.filter(playerData =>
                playerData.player?.id !== playerId
            )

            // Retire aussi ce joueur des favoris s'il était favori.
            this.favoritePlayers = this.favoritePlayers.filter(playerData =>
                playerData.player?.id !== playerId
            )

            // Sauvegarde les deux listes mises à jour.
            this.saveCustomPlayers()
            this.saveFavorites()
        },

        // Ajoute ou enlève un joueur des favoris.
        toggleFavorite(playerData) {
            // Cherche si le joueur existe déjà dans les favoris.
            const index = this.favoritePlayers.findIndex(favorite =>
                favorite.player?.id === playerData.player?.id
            )

            // Si index vaut -1, le joueur n'est pas encore favori.
            if (index === -1) {
                this.favoritePlayers.push(playerData)
            } else {
                // Sinon, il est déjà favori, donc on le retire.
                this.favoritePlayers.splice(index, 1)
            }

            // Sauvegarde les favoris dans localStorage.
            this.saveFavorites()
        },

        // Supprime un joueur des favoris grâce à son id.
        deleteFavorite(playerId) {
            this.favoritePlayers = this.favoritePlayers.filter(playerData =>
                playerData.player?.id !== playerId
            )

            // Sauvegarde après suppression.
            this.saveFavorites()
        },

        // Sauvegarde les favoris dans le navigateur.
        saveFavorites() {
            localStorage.setItem('favoritePlayers', JSON.stringify(this.favoritePlayers))
        },

        // Recharge les favoris depuis le navigateur.
        loadFavorites() {
            const savedFavorites = localStorage.getItem('favoritePlayers')

            if (savedFavorites) {
                this.favoritePlayers = JSON.parse(savedFavorites)
            }
        },

        // Sauvegarde les joueurs personnalisés dans le navigateur.
        saveCustomPlayers() {
            localStorage.setItem('customPlayers', JSON.stringify(this.customPlayers))
        },

        // Recharge les joueurs personnalisés depuis le navigateur.
        loadCustomPlayers() {
            const savedCustomPlayers = localStorage.getItem('customPlayers')

            if (savedCustomPlayers) {
                this.customPlayers = JSON.parse(savedCustomPlayers)
            }
        }
    }
})