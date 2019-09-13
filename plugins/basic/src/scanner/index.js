const path = require('path');
const fs = require('fs-extra');
const spawn = {
	installing: require('./src/components/process/install'),
	scanning: require('../process/scan')
};

module.exports = function Structure({ utils, temp }) {
	try {
		fs.removeSync(temp.path);
	} catch (e) {
		fs.mkdirSync(temp.path, { recursive: true });
	}

	const port = observer.address().port;
	const SCANNER_ENV =  Object.assign({}, process.env, {
		TDK_MODE: 'scan',
		OBSERVER_PORT: port,
		OBSERVER_HOST: '127.0.0.1',
	});

	return {
		async parse(agent, source) {
			await source.$update({ status: 2 });
			
			const dirname = path.join(temp.path, Math.random().toString(16).substr(2, 8));

			try {
				const sourceBuffer = await agent.fetch();
	
				await fs.ensureDir(dirname);
				await utils.unzip(sourceBuffer, dirname);
				await source.$update({ status: 3 });
			} catch (error) {
				return source.$update({ error: error.message });
			}

			try {
				await spawn.installing(dirname);
				await source.$update({ status: 4 });
			} catch (error) {
				return source.$update({ error: error.message });
			}

			try {
				const structure = await spawn.scanning();
				
				await source.$update({ status: 5, structure });
			} catch (error) {
				source.$update({error: error.message });
			}
		}
	};
};