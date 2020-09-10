require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const authCtrl = require('./controllers/authController')

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

