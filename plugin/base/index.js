const path = require('path');
const fs = require('fs');
const ID = {
	SOURCE_AGENT: 'basic.local'
};

function normalize() {

}

module.exports = function BasicSuitePluginProvider(originalOptions) {
	const options = normalize(originalOptions);
	const store = {};

	return {
		name: 'Examiner Basic Plugin Suite',
		id: 'com.oc.basic',
		version: '1.0.0',
		description: 'Basic functions for getting started.',
		install: function BasicSuitePluginInstall(examiner) {
			examiner.executor('basic.local', function BaseLocalExecutor(sourceAgent) {
				
			});

			examiner.router(function install(pluginRouter, { Model, scanner, Tester }) {
				pluginRouter.post('/com.oc.basic/source/:sourceId/agent', async ctx => {
					const { sourceId } = ctx.params;
					const fileOptions = ctx.request.files.source;
					const source = await Model.Source.query({ sourceId });
					
					if (!source || source.initialized || source.agent !== ID.SOURCE_AGENT) {
						return ctx.throw(412, 'Bad source state.');
					}

					await new Promise((resolve, reject) => {
						fs.readFile(fileOptions.path, (err, data) => {
							if (err) {
								return reject(err);
							}
	
							store[sourceId] = data;
							resolve();
						});
					});

					const agent = new Tester.SourceAgent[ID.SOURCE_AGENT](sourceId);
					const structure = await scanner.parse(agent);
	
					ctx.body = await source.$update({ structure });
				});

				pluginRouter.post('/com.oc.basic/execution/:execution/executor', ctx => {

				});
			});

				

			examiner.sourceAgent(ID.SOURCE_AGENT, function BasicLocalSourceAgent(sourceId) {
				return {
					async fetch() {
						return store[sourceId];
					}
				};
			});
	
			// product.reporter('base.report.html', function BaseReporterHtml() {
	
			// });
	
			examiner.entry(path.join(__dirname, 'app/index.js'));
		}
	};
};