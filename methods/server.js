const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Hello World\n');
});

// Pool allows you to make multiple connection requests to your server
const { Pool } = require('pg'); 

	const pool = new Pool({
		user: 'admin',
		host: 'localhost',
		database: 'postgres',
		password: 'admin123',
		port: '5432'
	});
	
	module.exports = { pool };


server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`)
});

