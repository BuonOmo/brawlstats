const countItems = array => {
    return array.reduce((prev, curr) => {
        if (!prev[curr]) prev[curr] = 0
        prev[curr] += 1
        return prev
    }, {})
}

Vue.filter('percent', (value) => {
    return Math.round(value * 100)
})

const vue = new Vue({
    el: '#app',
    data: {
        games: [],
        tag: '#9GC8JLRUV'
    },
    async created() {
        const response = await fetch('battles').then(response => response.text())
        this.games = response.split('\n').slice(0,-2).map(line => JSON.parse(line))
    },
    computed: {
        winratePerBrawler3v3() {
            const gamesWithBrawlers =
                this.games
                    .filter(game => game.battle.teams && game.battle.teams.length === 2)
                    .map(game => ({ result: game.battle.result, brawler: this.brawlerFor(game) }))
            return _.mapValues(
                _.groupBy(gamesWithBrawlers, (game) => game.brawler.name),
                games => {
                    const count = {
                        victory: 0,
                        defeat: 0,
                        draw: 0,
                        ..._.countBy(games, ({ result }) => result)
                    }
                    return {
                        ...count,
                        winrate: count.victory / (count.victory + count.defeat + count.draw)
                    }
                }
            )
        },
        winratePerGameMode() {
            const perMode = _.groupBy(this.games.filter(game => game.battle.rank || game.battle.result), 'battle.mode')
            return _.mapValues(perMode, (games) => {
                if (games[0].battle.rank) return { rank: _.sumBy(games, 'battle.rank') / games.length }

                const count = {
                    victory: 0,
                    defeat: 0,
                    draw: 0,
                    ..._.countBy(games, 'battle.result')
                }
                return {
                    ...count,
                    winrate: count.victory / (count.victory + count.defeat + count.draw)
                }
            })
        }
    },
    methods: {
        everyBrawlers(game) {
            return game.battle.players || _.flatten(game.battle.teams)
        },
        brawlerFor(game) {
            return this.everyBrawlers(game).find(player => player.tag === this.tag).brawler
        },
        upcaseToTitle(string) {
            return _.startCase(string.toLowerCase())
        },
        camelcaseToTitle(string) {
            return _.startCase(string)
        },
        urlFor(path, resource) { // resource must be title case
            resource = resource.replace(/\s/g, '-')
            return `https://starlist.pro/img/${path}${resource}.png`
        }
    }
})

window.vue = vue
