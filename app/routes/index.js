const express = require('express')
const router = express.Router()

const createWallet = require('../methods/createWallet.js')
const { pool } = require('../methods/db.js')

router.get('/', (req, res) => {
  res.render('index', { text: 'This is the dynamic data. Open index.js from the routes directory to see.' })
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

router.get('/createWallet/:userId', async(req, res) => {
  const userId = req.params.userId
  var username = (await(await (pool.query(`SELECT username FROM accounts WHERE user_id = '${userId}'`))).rows[0]?.username);
  var walletId = (await(await (pool.query(`SELECT wallet_id FROM account_wallets WHERE user_id = '${userId}'`))).rows[0]?.wallet_id);
  if (walletId == undefined) {
    createWallet(userId);
  } else {
    res.send('User already has a wallet')
  }
  res.redirect('/profile/' + username);
})

router.get('/registerUser', (req, res) => {
  res.render('registerUser', null)
})

router.get('/login', (req, res) => {
  res.render('login', null)
})

module.exports = router
