'use strict';

const { spawn } = require('child_process');

module.exports = async function spawnInstallingProcess(cwd) {
	await new Promise((resolve, reject) => {
		const installing = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', [
			'install'
		], { cwd });
	
		let message = Buffer.from([]);

		installing.stderr.on('data', function (data) {
			message = Buffer.concat([message, data], message.length + data.length);
		});

		installing
			.on('error', err => reject(err))
			.on('close', code => {
				if (code !== 0) {
					reject({ message: message.toString() });
				} else {
					resolve();
				}
			});
	});
};