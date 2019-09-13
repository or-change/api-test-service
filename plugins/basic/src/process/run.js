'use strict';

const path = require('path');
const { spawn } = require('child_process');

module.exports = function spawnRunningProcess(cwd, port, sessionId) {
	return new Promise((resolve, reject) => {
		spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', [
			'mocha',
			'--reporter',
			'@or-change/tdk/reporter',
			'--require',
			path.join(__dirname, 'log.js')
		], {
			cwd,
			env: Object.assign({}, process.env, {
				EXECUTION_SESSION: sessionId,
				OBSERVER_PORT: port,
				OBSERVER_HOST: '127.0.0.1',
			})
		}).on('close', () => resolve());
	});
};