// Full Documentation - https://docs.turbo360.co
const vertex = require('vertex360')({ site_id: process.env.TURBO_APP_ID })
const express = require('express')
const { Pool } = require('pg');

const app = express() // initialize app

/*  Apps are configured with settings as shown in the conig object below.
    Options include setting views directory, static assets directory,
    and database settings. Default config settings can be seen here:
    https://docs.turbo360.co */

const config = {
  views: 'views', // Set views directory
  static: 'public', // Set static assets directory
  logging: true,

  /*  To use the Turbo 360 CMS, from the terminal run
      $ turbo extend cms
      then uncomment line 21 below: */

  // db: vertex.nedb()
}

// Pool allows you to make multiple connection requests to your server
	const pool = new Pool({
		user: 'admin',
		host: 'localhost',
		database: 'postgres',
		password: 'admin123',
		port: '5432'
	});

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
