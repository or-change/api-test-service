const TIMEOUT = 1 * 60 * 1000;

module.exports = function ExecutionDispatcher() {
	const store = {};

	return {
		createSession(options) {
			const id = Math.random().toString(16).substr(2, 8);

			store[id] = {
				structure: null,
				timer: setTimeout(() => this.destroy(id), options.timeout || TIMEOUT)
			};
			
			return id;
		},
		getSessionById(sessionId) {
			return store[sessionId] || null;
		},
		destroySession(sessionId) {
			clearTimeout(store[sessionId].timer);
			delete this.store[sessionId];
		}
	};
};