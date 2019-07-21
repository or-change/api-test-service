const EventEmitter = require('events');

function normalize(options) {

}

module.exports = function ExecutorProvider(originOptions) {
	const { progress, start } = normalize(originOptions);

	return function Executor(source) {
		const Executor = new EventEmitter();

		(async function() {
			const total = await start(source);

			Executor.emit('start', total);

			(async function getProgress() {
				const ended = await progress.get();
	
				Executor.emit('progress', ended);
	
				if (ended < total) {
					setTimeout(getProgress, progress.cycle);
				} else {
					Executor.emit('end');
				}
			}());
		}());
		
		return Executor;
	};
};