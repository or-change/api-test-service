const DataHub = require('@or-change/data-hub');

const Account = require('./Account');
const Project = require('./Project');
const Exection = require('./Execution');
const Source = require('./Source');
const Report = require('./Report');

const ModelMapping = Object.assign({
	Product() {
		return {
			schemas: {
				type: 'object'
			},
			methods: {
				async query() {

				},
				async update() {
					
				}
			}
		};
	}
}, Account, Project, Exection, Source, Report);

module.exports = function Model(options, product) {
	const { org: name } = options;
	const models = {};

	for (const symbol in ModelMapping) {
		const modelOptions = ModelMapping[symbol](options, product);

		modelOptions.symbol = symbol;
		models[symbol] = modelOptions;
	}

	const hub = DataHub.create({
		id: `org.${name}.service.testing.api`,
		models
	});

	return hub.model;
};