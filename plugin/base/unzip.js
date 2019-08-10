const fs = require('fs-extra');
const path = require('path');
const yauzl = require('yauzl');

module.exports = function unzip(buffer, dir) {
	return new Promise((resolve, reject) => {
		yauzl.fromBuffer(buffer, {
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
};