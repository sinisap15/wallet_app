const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    const data = req.body
    res.render('register', data)
})

module.exports = router
