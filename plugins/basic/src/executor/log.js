const http = require('http');
const {
	EXECUTION_SESSION,
	OBSERVER_HOST,
	OBSERVER_PORT
} = process.env;

const URL = `http://${OBSERVER_HOST}:${OBSERVER_PORT}/${EXECUTION_SESSION}`;

function request(method, path, message) {
	return http.request(`${URL}${path}`, {
		method,
		headers: {
			'Content-Type': 'application/json'
		}
	}).end(message || '');
}

const state = {
	log: [],
	finished: 0
};

global._TDK_ = {
	structure(object) {
		request('POST', '/ready', JSON.stringify(object));
	},
	log(type, message) {
		state.log.push({
			time: Date.now(),
			type,
			message
		});
	},
	progress() {
		request('GET', `/progress/${++state.finished}`);
	},
	end() {
		request('POST', '/log', JSON.stringify(state.log));
	}
};