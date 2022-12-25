const express = require('express')
const router = express.Router()
const { pool } = require('../public/js/db.js')
const createUser = require('../public/js/createUser.js')
const createWallet = require('../public/js/createWallet.js')
const addFunds = require('../public/js/addFunds.js')
const removeFunds = require('../public/js/removeFunds.js')

router.post('/win/:userId', async (req, res) => {
    const body = req.body
    const userId = req.params.userId
    const amount = parseFloat(body.win)
    var walletId = (await (await (pool.query(`SELECT wallet_id FROM account_wallets WHERE user_id = '${userId}'`))).rows[0]?.wallet_id);
    console.log(amount)
    addFunds(amount, walletId);
    res.redirect('/' + userId + '/play')
})

router.post('/bet/:userId', async (req, res) => {
    const body = req.body
    const userId = req.params.userId
    const amount = parseFloat(body.bet)
    var walletId = (await (await (pool.query(`SELECT wallet_id FROM account_wallets WHERE user_id = '${userId}'`))).rows[0]?.wallet_id);
    removeFunds(amount, walletId);
    res.redirect('/' + userId + '/play')
})


module.exports = router
