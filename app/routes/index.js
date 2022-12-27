const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index', null)
})

router.get('/query', (req, res) => {
  const username = req.query.username;
  const game = req.query.game;
  const data = {
    username: username,
    game: game
  }
  res.render('profile', data);
})

router.get('/register', (req, res) => {
  res.render('register', null)
})

router.get('/login', (req, res) => {
  res.render('login', null)
})

module.exports = router
