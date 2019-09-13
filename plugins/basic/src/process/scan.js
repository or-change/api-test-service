
const installing = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', [
	'mocha',
	'--reporter',
	'@or-change/tdk/reporter',
	'--require',
	path.join(__dirname, 'log.js')
], {
	cwd: dir,
	env: Object.assign({
		SCANNER_SESSION: sessionId
	}, SCANNER_ENV)
});

let message = Buffer.from([]);

installing.stderr.on('data', function (data) {
	message = Buffer.concat([message, data], message.length + data.length);
});

installing.on('close', (code) => {
	fs.remove(dir);

	if (code !== 0) {
		reject({ message: message.toString() });
	}
});