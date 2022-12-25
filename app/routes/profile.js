const express = require('express')
const router = express.Router()
const { pool } = require('../methods/db.js')
const createUser = require('../methods/createUser.js')
const createWallet = require('../methods/createWallet.js')
const addFunds = require('../methods/addFunds.js')
const removeFunds = require('../methods/removeFunds.js')

router.post('/profile', (req, res) => {
    const body = req.body
    const username = body.username
    res.redirect('/profile/' + username)
})

router.get('/profile/:username', async (req, res) => {
    const username = req.params.username
    var userId = (await (await (pool.query(`SELECT user_id FROM accounts WHERE username = '${username}'`))).rows[0]?.user_id);
    if (userId == undefined) {
        res.send('User does not exist');
    } else {
        var walletId = (await (await (pool.query(`SELECT wallet_id FROM account_wallets WHERE user_id = '${userId}'`))).rows[0]?.wallet_id);
        if (walletId != undefined) {
            var wallet_funds = (await (await (pool.query(`SELECT funds FROM wallet WHERE wallet_id = '${walletId}'`))).rows[0]?.funds);
            console.log(wallet_funds)
        }
        const user = {
            userId,
            username,
            wallet_funds: wallet_funds ?? 'No wallet found'
        }
        res.render('profile', user)
    }
})

router.get('/createWallet/:userId', async (req, res) => {
    const userId = req.params.userId
    var username = (await (await (pool.query(`SELECT username FROM accounts WHERE user_id = '${userId}'`))).rows[0]?.username);
    var walletId = (await (await (pool.query(`SELECT wallet_id FROM account_wallets WHERE user_id = '${userId}'`))).rows[0]?.wallet_id);
    if (walletId == undefined) {
        createWallet(userId);
    } else {
        res.send('User already has a wallet')
    }
    res.redirect('/profile/' + username);
})

router.post('/addProfile', (req, res) => {
    const body = req.body
    // body['skills'] = req.body.skills.split(',')

    createUser(body.username, body.firstName, body.lastName, body.password, body.email, new Date());
    res.send('User added to database');
    // res.redirect('/profile/' + body.username)
})

router.post('/deposit/:userId', async (req, res) => {
    const body = req.body
    const userId = req.params.userId
    const amount = parseFloat(body.deposit)
    console.log(amount);
    if (amount <= 0 || isNaN(amount)) {
        res.send('Invalid amount')
    }
    var walletId = (await (await (pool.query(`SELECT wallet_id FROM account_wallets WHERE user_id = '${userId}'`))).rows[0]?.wallet_id);
    var username = (await (await (pool.query(`SELECT username FROM accounts WHERE user_id = '${userId}'`))).rows[0]?.username);
    addFunds(amount, walletId);
    res.redirect('/profile/' + username)
})

router.post('/withdraw/:userId', async (req, res) => {
    const body = req.body
    const userId = req.params.userId
    const amount = parseFloat(body.withdraw)
    if (amount <= 0 || isNaN(amount)) {
        res.send('Invalid amount')
    }
    var walletId = (await (await (pool.query(`SELECT wallet_id FROM account_wallets WHERE user_id = '${userId}'`))).rows[0]?.wallet_id);
    var username = (await (await (pool.query(`SELECT username FROM accounts WHERE user_id = '${userId}'`))).rows[0]?.username);
    removeFunds(amount, walletId);
    res.redirect('/profile/' + username)
})

router.get('/:userId/play', async(req, res) => {
    const body = req.body
    const userId = req.params.userId
    var walletId = (await (await (pool.query(`SELECT wallet_id FROM account_wallets WHERE user_id = '${userId}'`))).rows[0]?.wallet_id);
    var funds = (await (await (pool.query(`SELECT funds FROM wallet WHERE wallet_id = '${walletId}'`))).rows[0]?.funds);
    var username = (await (await (pool.query(`SELECT username FROM accounts WHERE user_id = '${userId}'`))).rows[0]?.username);
    var user = {
        userId,
        username,
        walletId,
        funds
    }
    res.render('play', user)
})

module.exports = router
