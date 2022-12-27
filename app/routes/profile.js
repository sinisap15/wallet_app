const express = require('express')
const router = express.Router()
const createUser = require('../public/js/createUser.js')
const createWallet = require('../public/js/createWallet.js')
const addFunds = require('../public/js/addFunds.js')
const removeFunds = require('../public/js/removeFunds.js')
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { getWalletId } = require('../public/js/app.js'); 
const { getFunds } = require('../public/js/app.js');
const { getUserId } = require('../public/js/app.js');
const { getUsername } = require('../public/js/app.js');
const { getTransactions } = require('../public/js/app.js');

router.post('/profile', (req, res) => {
    const body = req.body
    const username = body.username
    res.redirect('/profile/' + username)
})

router.get('/profile/:username', async (req, res) => {
    const username = req.params.username
    var userId = await getUserId(username);
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
    var username = await getUsername(userId);
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
    if (amount <= 0 || isNaN(amount)) {
        return res.jsonp({error: 'Invalid amount'})
    }
    var walletId = await getWalletId(userId);
    var username = await getUsername(userId);
    addFunds(amount, walletId, 'Deposit');
    res.redirect('/profile/' + username)
})

router.post('/withdraw/:userId', async (req, res) => {
    const body = req.body
    const userId = req.params.userId
    const amount = parseFloat(body.withdraw)
    var walletId = await getWalletId(userId);
    var username = await getUsername(userId);
    var funds = await getFunds(walletId);
    if (amount <= 0 || isNaN(amount)) {
        return res.jsonp({error: 'Invalid amount'})
    } else if (amount > funds) {
        return res.jsonp({error: 'Insufficient funds'})
    }
    removeFunds(amount, walletId, 'Withdraw');
    res.redirect('/profile/' + username)
})

router.get('/:userId/play', async(req, res) => {
    const userId = req.params.userId
    var walletId = await getWalletId(userId);
    var funds = await getFunds(walletId);
    var username = await getUsername(userId);
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
    var transactions = await getTransactions(userId);
    res.json({transactions})
})

module.exports = router
