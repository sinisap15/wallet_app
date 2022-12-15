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
const dotenv = require('./node_modules/dotenv/lib/main');
dotenv.config();

const connectDb = async () => {
	try {
		const pool = new Pool({
			user: 'admin',
			host: 'localhost',
			database: 'postgres',
			password: 'admin123',
			port: '5432'
		})

		await pool.connect();
		// Select all users from accounts
		const res = await pool.query('SELECT * FROM accounts');
		console.log(res.rows);
		await pool.end();
	} catch (error) {
		console.log(error);
	}
}

connectDb();

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`)
});

