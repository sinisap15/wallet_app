const express = require('express')
const router = express.Router()
const { pool } = require('../public/js/db.js')
const addFunds = require('../public/js/addFunds.js')
const removeFunds = require('../public/js/removeFunds.js')
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(session({secret: 'ssshhhhh', resave: false}))
session.Store.amountBet = 0;

router.post('/win/:userId', async (req, res) => {
    const body = req.body
    const userId = req.params.userId
    const amount = parseFloat(body.win)
    if (amount > session.Store.amountBet) {
        session.Store.amountBet = 0;
    } else {
        session.Store.amountBet -= amount;
    }
    var walletId = (await (await (pool.query(`SELECT wallet_id FROM account_wallets WHERE user_id = '${userId}'`))).rows[0]?.wallet_id);
    addFunds(amount, walletId);
    res.redirect('/' + userId + '/play')
})

router.post('/bet/:userId', async (req, res) => {
    const body = req.body
    const userId = req.params.userId
    var  amount = parseFloat(body.bet)
    var walletId = (await (await (pool.query(`SELECT wallet_id FROM account_wallets WHERE user_id = '${userId}'`))).rows[0]?.wallet_id);
    var funds = (await (await (pool.query(`SELECT funds FROM wallet WHERE wallet_id = '${walletId}'`))).rows[0]?.funds);
    if (funds < amount) {
        amount = 0
        return res.jsonp({
            status: 'fail',
            error: 'Insufficient funds'
        })
    }
    session.Store.amountBet += amount;
    removeFunds(amount, walletId);
    res.redirect('/' + userId + '/play')
})


module.exports = router
