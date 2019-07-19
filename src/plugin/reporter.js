module.exports = function Reporter(options) {
	const { build } = options;

	return {
		async build(structure, log, options) {
			return await build(structure, log, options);
		}
	};
};