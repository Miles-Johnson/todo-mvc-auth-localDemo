const express = require('express')
//setup express router object
const router = express.Router()

//import auth endpoints?
const authController = require('../controllers/auth') 
const homeController = require('../controllers/home')
//import passport auth functions?
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', homeController.getIndex)
router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)
router.get('/logout', authController.logout)
router.get('/signup', authController.getSignup)
router.post('/signup', authController.postSignup)

module.exports = router