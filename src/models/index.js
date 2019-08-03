const DataHub = require('@or-change/data-hub');

const Account = require('./Account');
const Project = require('./Project');
const Exection = require('./Execution');
const Source = require('./Source');

const ModelMapping = Object.assign({}, Account, Project, Exection, Source);

module.exports = function Model(options) {
	const { org: name } = options;
	const models = {};

	for (const symbol in ModelMapping) {
		const modelOptions = ModelMapping[symbol](options);

		modelOptions.symbol = symbol;
		models[symbol] = modelOptions;
	}

	const hub = DataHub.create({
		id: `org.${name}.service.testing.api`,
		models
	});

	return hub.model;
};