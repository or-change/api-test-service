const yauzl = require("yauzl");
const path = require('path');
const fs = require('fs');

module.exports = function Structure(options) {
	const dir = path.join(options.path, Math.random().toString(16).substr(2,8));

	try {
		fs.statSync(dir);
	} catch (e) {
		fs.mkdirSync(dir, { recursive: true });
	}

	return {
		async parse(agent) {
			const source = await agent.fetch();

			await new Promise((resolve, reject) => {
				extract(source, { dir }, err => {
					if (err) {
						return reject(err);
					}

					resolve();
				});
			});
		}
	};
};