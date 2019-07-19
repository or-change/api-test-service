const EventEmitter = require('events');

module.exports = function Executor(options) {
	const { scan, start } = options;

	class Executor extends EventEmitter {
		constructor(options) {
			super();

			this.source = {
				path: options.path
			};
		}

		async scan() {
			return await scan(this.source);
		}

		async start() {
			return await start(this.source);
		}
	}

	return {
		
	};
};