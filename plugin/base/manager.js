const TIMEOUT = 15 * 60 * 1000;

module.exports = function ExecutionManager() {
	return {
		store: {},
		create(execution) {
			const id = Math.random().toString(16).substr(2, 8);

			this.store[id] = {
				execution,
				structure: null,
				timer: setTimeout(() => this.destroy(id), TIMEOUT)
			};
			
			return id;
		},
		destroy(sessionId) {
			clearTimeout(this.store[sessionId].timer);
			delete this.store[sessionId];
		}
	};
};