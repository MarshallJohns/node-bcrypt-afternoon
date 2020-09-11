require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const authCtrl = require('./controllers/authController')
const treasureCtrl = require(`./controllers/treasureController`)
const auth = require('./middleWare/authMiddleWare')

const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env

const app = express();
app.use(express.json())
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookies: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
    }
}))

massive({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
}).then(dbInstance => {
    app.set('db', dbInstance)
    console.log('DB READY')
    app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`))
})


app.post(`/auth/register`, authCtrl.register)
app.post(`/auth/login`, authCtrl.login)
app.get('/auth/logout', authCtrl.logout)

app.get(`/api/treasure/dragon`, treasureCtrl.dragonTreasure)
app.get(`/api/treasure/user`, auth.usersOnly, treasureCtrl.getUserTreasure)
app.post(`/api/treasure/user`, auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)
