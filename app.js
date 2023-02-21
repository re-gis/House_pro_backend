const express = require('express')
const connectDB = require('./config/db')
const router = require('./routes/userRoute')
const landRouter = require('./routes/landlordRoute')
const app = express()
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const sessions = require('express-session')
const passport = require('passport')
app.use(sessions({ secret: process.env.AUTH_SECRET }))
app.use(passport.initialize())
app.use(passport.session())

require('./auth/userAuth')


// BodyParser stuff
app.use(bodyParser.urlencoded({ extended: false }))

// Connecting database
connectDB()

// Website landing page
app.get('/', (req, res) => {
    res.json({ message: 'Website landing page'})
})

app.use('/users', router)
app.use('/landlord', landRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server listening port ${process.env.PORT}...`);
})