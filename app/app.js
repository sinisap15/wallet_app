"use strict";
const vertex = require('vertex360')({ site_id: process.env.TURBO_APP_ID })
const express = require('express')

var cookieParser = require('cookie-parser');
var session = require('express-session');

const app = express() // initialize app

app.use(cookieParser());


const config = {
  views: 'views', // Set views directory
  static: 'public', // Set static assets directory
  logging: true,
  // db: vertex.nedb()
}


vertex.configureApp(app, config)

// import routes
const index = require('./routes/index')
const profile = require('./routes/profile')
const bet = require('./routes/bet')

// set routes
app.use('/', index)
app.use('/', profile)
app.use('/', bet)

module.exports = app
