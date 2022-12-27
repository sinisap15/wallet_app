const express = require('express')
const router = express.Router()
const { pool } = require('../public/js/db.js')
const createUser = require('../public/js/createUser.js')
const createWallet = require('../public/js/createWallet.js')
const addFunds = require('../public/js/addFunds.js')
const removeFunds = require('../public/js/removeFunds.js')
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { getWalletId } = require('../public/js/db.js'); 
const { getFunds } = require('../public/js/db.js');

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
        var walletId = await getWalletId(userId);
        if (walletId != undefined) {
            var funds = await getFunds(walletId);
        }
        const user = {
            userId,
            username,
            wallet_funds: funds ?? 'No wallet found'
        }
        res.render('profile', user)
    }
})

router.get('/createWallet/:userId', async (req, res) => {
    const userId = req.params.userId
    var username = (await (await (pool.query(`SELECT username FROM accounts WHERE user_id = '${userId}'`))).rows[0]?.username);
    var walletId = await getWalletId(userId);
    if (walletId == undefined) {
        createWallet(userId);
        res.redirect('/profile/' + username);
    } else {
        res.json({
            status: 'fail',
            error: 'User already has a wallet'
        })
    }
})

router.post('/addProfile', (req, res) => {
    const body = req.body

    createUser(body.username, body.firstName, body.lastName, body.password, body.email, new Date());
    res.redirect('/login')
})

router.post('/deposit/:userId', async (req, res) => {
    const body = req.body
    const userId = req.params.userId
    const amount = parseFloat(body.deposit)
    console.log(amount);
    if (amount <= 0 || isNaN(amount)) {
        return res.jsonp({error: 'Invalid amount'})
    }
    var walletId = await getWalletId(userId);
    var username = (await (await (pool.query(`SELECT username FROM accounts WHERE user_id = '${userId}'`))).rows[0]?.username);
    addFunds(amount, walletId);
    res.redirect('/profile/' + username)
})

router.post('/withdraw/:userId', async (req, res) => {
    const body = req.body
    const userId = req.params.userId
    const amount = parseFloat(body.withdraw)
    var walletId = await getWalletId(userId);
    var username = (await (await (pool.query(`SELECT username FROM accounts WHERE user_id = '${userId}'`))).rows[0]?.username);
    var funds = await getFunds(walletId);
    if (amount <= 0 || isNaN(amount)) {
        return res.jsonp({error: 'Invalid amount'})
    } else if (amount > funds) {
        return res.jsonp({error: 'Insufficient funds'})
    }
    removeFunds(amount, walletId);
    res.redirect('/profile/' + username)
})

router.get('/:userId/play', async(req, res) => {
    const userId = req.params.userId
    var walletId = await getWalletId(userId);
    var funds = await getFunds(walletId);
    var username = (await (await (pool.query(`SELECT username FROM accounts WHERE user_id = '${userId}'`))).rows[0]?.username);
    // this could be wrong beacuse we need stateless application but express-session makes it - not strictly stateless
    app.use(session({secret: 'ssshhhhh'}))
    var user = {
        userId,
        username,
        walletId,
        funds,
        bettedAmount: session.Store.amountBet
    }
    res.render('play', user)
})

router.get('/view/transactions/:userId', async(req, res) => {
    const userId = req.params.userId
    var transactions = (await (await (pool.query(`SELECT * FROM transactions WHERE user_id = '${userId}'`))).rows);
    res.json({transactions})
})

module.exports = router
