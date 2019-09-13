const http = require('http');

module.exports = function ScannerObserver() {
	
	const observer = http.createServer((req, res) => {
		const { url } = req;
		const [, sessionId, illegal] = url.split('/');
		const session = Session.store[sessionId];

		if (req.method !=='POST' || illegal) {
			res.statusCode = 400;
		} else if (!session) {
			res.statusCode = 404;
		} else {
			let data = Buffer.from([]);
	
			req.on('data', chunk => {
				data = Buffer.concat([data, chunk], data.length + chunk.length);
			}).on('end', () => session.callback(JSON.parse(data.toString())));
			res.statusCode = 200;
		}

		res.end();
	}).listen();
}