const express = require('express')
const passport = require('passport')
const { loginUser, userLanding, userSignup, emailVerify } = require('../controllers/userController')
const { isLoggedIn } = require('../middlewares/authMiddleware')
const router = express.Router()

// User page
router.get('/', userLanding)

// Signup route
router.post('/signup', userSignup)

// Email verification
router.get('/verify/:id/:token', emailVerify)

// Login router
router.post('/login', loginUser)

// Google login
router.get('/auth/google', passport.authenticate('google', {scope: ['email', 'profile']}))


// Checking if the loggin process succeeded or failed
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/success',
    failureRedirect: '/auth/failure',
}))


// If the user is logged in using GoogleAuth
router.get('/success', isLoggedIn, (req, res) => {
    res.json({ message: 'Good to go'})
})


// If there is an error while logging in
router.get('/auth/failure', (req, res) => {
    res.json({ message: 'Sommething odd happened!'})
})

// Logout the user
router.get('/logout', (req, res) => {
    req.session.destroy()
    res.send('User logged out!')
})


module.exports = router