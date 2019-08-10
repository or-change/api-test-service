const http = require('http');
const {
	SCANNER_SESSION,
	OBSERVER_HOST,
	OBSERVER_PORT
} = process.env;

const URL = `http://${OBSERVER_HOST}:${OBSERVER_PORT}/${SCANNER_SESSION}`;

function request(method, path, message) {
	return http.request(`${URL}/${path}`, {
		method,
		headers: {
			'Content-Type': 'application/json'
		}
	}).on('close', () => {
		process.exit(0);
	}).end(message);
}

const state = {
	log: [],
	finished: 0
};

global.__TDK__ = {
	structure(object) {
		request('POST', '/structure', JSON.stringify(object));
	},
	log(type, message) {
		state.log.push({
			time: Date.now(),
			type,
			message
		});
	},
	progress() {
		state.finished++;
		request('GET', '/progress', JSON.stringify({ finished: state.finished }));
	},
	end() {
		request('POST', '/log', JSON.stringify(state.log));
	}
};