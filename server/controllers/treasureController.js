module.exports = {
    dragonTreasure: async (req, res) => {
        const db = req.app.get('db')

        const treasure = await db.get_dragon_treasure([1])

        return res.status(200).send(treasure)

    },

    getUserTreasure: async (req, res) => {
        const db = req.app.get('db')

        const userTreasure = await db.get_user_treasure([req.session.user.id])
        return res.status(200).send(userTreasure)
    },

    addUserTreasure: async (req, res) => {
        const { treasureURL } = req.body
        const { id } = req.session.user
        const userTreasure = await req.app.get('db').add_user_treasure([treasureURL, id])

        return res.status(200).send(userTreasure)

    },
}