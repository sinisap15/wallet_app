const express = require('express')
const router = express.Router()
const { pool } = require('../methods/db.js')
const createUser = require('../methods/createUser.js')
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

router.post('/addProfile', (req, res) => {
    const body = req.body
    // body['skills'] = req.body.skills.split(',')

    createUser(body.username, body.firstName, body.lastName, body.password, body.email, new Date());
    res.send('User added to database');
    // res.redirect('/profile/' + body.username)
})

router.post('/deposit/:userId', async(req,res) => {
    const body = req.body
    const userId = req.params.userId
    const amount = parseFloat(body.deposit)
    var walletId = (await(await (pool.query(`SELECT wallet_id FROM account_wallets WHERE user_id = '${userId}'`))).rows[0]?.wallet_id);
    var username = (await(await (pool.query(`SELECT username FROM accounts WHERE user_id = '${userId}'`))).rows[0]?.username);
    addFunds(amount, walletId);
    res.redirect('/profile/' + username)
})

router.post('/withdraw/:userId', async(req,res) => {
    const body = req.body
    const userId = req.params.userId
    const amount = parseFloat(body.withdraw)
    var walletId = (await(await (pool.query(`SELECT wallet_id FROM account_wallets WHERE user_id = '${userId}'`))).rows[0]?.wallet_id);
    var username = (await(await (pool.query(`SELECT username FROM accounts WHERE user_id = '${userId}'`))).rows[0]?.username);
    removeFunds(amount, walletId);
    res.redirect('/profile/' + username)
})

module.exports = router
