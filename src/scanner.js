const yauzl = require('yauzl');
const path = require('path');
const fs = require('fs-extra');
const { spawn } = require('child_process');
const http = require('http');

module.exports = function Structure(options) {
	try {
		fs.removeSync(options.path);
		fs.statSync(options.path);
	} catch (e) {
		fs.mkdirSync(options.path, {
			recursive: true
		});
	}

	const TIMEOUT = 60 * 1000;
	const Session = {
		store: {},
		create(scan) {
			const id = Math.random().toString(16).substr(2, 8);
			
			return new Promise((resolve, reject) => {
				scan(id, reject);

				this.store[id] = {
					callback(structure) {
						resolve(structure);
					},
					timer: setTimeout(() => reject(), TIMEOUT)
				};
			}).finally(() => {
				clearTimeout(this.store[id].timer);
				delete this.store[id];
			});
		}
	};

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

	const port = observer.address().port;
	const SCANNER_ENV =  Object.assign({}, process.env, {
		TDK_MODE: 'scan',
		OBSERVER_PORT: port,
		OBSERVER_HOST: '127.0.0.1',
	});

	return {
		async parse(agent, source) {
			const sourceBuffer = await agent.fetch();
			const dir = path.join(options.path, Math.random().toString(16).substr(2, 8));

			await fs.ensureDir(dir);
			await new Promise((resolve, reject) => {
				yauzl.fromBuffer(sourceBuffer, {
					lazyEntries: true
				}, (err, zipfile) => {
					if (err) {
						return reject(err);
					}

					zipfile.on('entry', async entry => {
						if (/\/$/.test(entry.fileName)) {
							await fs.ensureDir(path.join(dir, entry.fileName));
							zipfile.readEntry();
						} else {
							zipfile.openReadStream(entry, function (err, readStream) {
								if (err) {
									return reject(err);
								}

								readStream.on('end', function () {
									zipfile.readEntry();
								}).pipe(fs.createWriteStream(path.join(dir, entry.fileName)));
							});
						}
					}).on('end', () => resolve());

					zipfile.readEntry();
				});
			});

			await new Promise((resolve, reject) => {
				const installing = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', [
					'install'
				], {
					cwd: dir,
				});

				installing
					.on('error', err => reject(err))
					.on('close', code => resolve());
			});
			
			const structure = await Session.create((sessionId, reject) => {
				spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', [
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
				}).on('error', err => {
					reject(err);
				});
			});

			// fs.remove(dir);
			source.$update({ structure });
		}
	};
};