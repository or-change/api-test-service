const fs = require('fs-extra');
const path = require('path');
const yauzl = require('yauzl');

module.exports = function unzip(buffer, dirname) {
	return new Promise((resolve, reject) => {
		yauzl.fromBuffer(buffer, {
			lazyEntries: true
		}, (err, zipfile) => {
			if (err) {
				return reject(err);
			}

			zipfile.on('entry', async entry => {
				if (/\/$/.test(entry.fileName)) {
					await fs.ensureDir(path.join(dirname, entry.fileName));
					zipfile.readEntry();
				} else {
					zipfile.openReadStream(entry, (err, readStream) => {
						if (err) {
							return reject(err);
						}

						readStream
							.on('end', () => zipfile.readEntry())
							.pipe(fs.createWriteStream(path.join(dirname, entry.fileName)));
					});
				}
			}).on('end', () => resolve()).readEntry();
		});
	});
};