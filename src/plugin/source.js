module.exports = function Source(options) {
	const { fetch } = options;
	
	return {
		async fetchSource(project) {
			return await fetch(project);
		}
	};
};