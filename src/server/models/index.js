const DataHub = require('@or-change/data-hub');

const Account = require('./Account');
const Administrator = require('./Administrator');
const Project = require('./Project');

const ModelMapping = Object.assign({}, Account, Administrator, Project);

module.exports = function Model(options) {
	const { org: name, store } = options;
	const models = {};

	for (const symbol in ModelMapping) {
		const options = ModelMapping[symbol](store);

		options.symbol = symbol;
		models[symbol] = options;
	}

	const hub = DataHub.create({
		id: `org.${name}.service.testing.api`,
		models
	});

	return hub.model;
};