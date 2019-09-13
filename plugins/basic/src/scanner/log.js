const http = require('http');

const { SCANNER_SESSION, OBSERVER_HOST, OBSERVER_PORT } = process.env;
const URL = `http://${OBSERVER_HOST}:${OBSERVER_PORT}/${SCANNER_SESSION}`;

global._TDK_ = {
	structure(object) {
		http.request(URL, { method: 'POST' })
			.on('close', () => process.exit(0))
			.end(JSON.stringify(object));
	}
};