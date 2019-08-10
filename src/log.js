const CASETREE_REG = /caseTree/;
const http = require('http');
const {
	SCANNER_SESSION,
	OBSERVER_HOST,
	OBSERVER_PORT
} = process.env;

const URL = `http://${OBSERVER_HOST}:${OBSERVER_PORT}/${SCANNER_SESSION}`;
function send(message) {
	http.request(URL, { method: 'POST' }).end(message);
}

global.log = function (type, message) {
	if (type === 'tdk' && CASETREE_REG.test(message)) {
		send(message);
	}
};