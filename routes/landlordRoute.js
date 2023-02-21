const express = require('express')
const { landSignup } = require('../controllers/landlordController')
const router = express.Router()

// Landlord signup
router.get('landSign', landSignup)


module.exports = router