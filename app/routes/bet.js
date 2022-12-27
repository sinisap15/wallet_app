const express = require('express')
const router = express.Router()
const { pool } = require('../public/js/db.js')
const addFunds = require('../public/js/addFunds.js')
const removeFunds = require('../public/js/removeFunds.js')
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { getWalletId } = require('../public/js/db.js');
const { getFunds } = require('../public/js/db.js');

app.use(cookieParser());
app.use(session({secret: 'ssshhhhh', resave: false}))
session.Store.amountBet = 0;

router.post('/win/:userId', async (req, res) => {
    const body = req.body
    const userId = req.params.userId
    const amount = parseFloat(body.win)
    if (isNaN(amount)) {
        return res.jsonp({
            status: 'fail',
            error: 'Invalid amount'
        })
    }
    if (amount > session.Store.amountBet) {
        session.Store.amountBet = 0;
    } else {
        session.Store.amountBet -= amount;
    }
    var walletId = await getWalletId(userId);
    addFunds(amount, walletId);
    res.redirect('/' + userId + '/play')
})

router.post('/bet/:userId', async (req, res) => {
    const body = req.body
    const userId = req.params.userId
    var  amount = parseFloat(body.bet)
    var walletId = await getWalletId(userId);
    var funds = await getFunds(walletId);
    if (isNaN(amount)) {
        return res.jsonp({
            status: 'fail',
            error: 'Invalid amount'
        })
    }
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
