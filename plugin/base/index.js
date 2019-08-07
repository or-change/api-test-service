const path = require('path');

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
		install: function BasicSuitePluginInstall(examiner, { temp, Tester }) {
			examiner.executor('basic.local', function BaseLocalExecutor(sourceAgent) {
				
			});

			examiner.router(function install(pluginRouter, { Model }) {
				pluginRouter.post('/com.oc.basic/source/:sourceId/agent', ctx => {

				});
			});

				
			(async function () {
				// const agent = await SourceAgent(source.id);

				// await agent.setup(ctx);

				// const sturcture = await parseStructure(agent);

				// source.$update({ sturcture });
			}());

			examiner.sourceAgent('basic.local', async function BasicLocalSourceAgent(sourceId) {
				return {
					async setup(ctx) {
						return new Promise((resolve, reject) => {
							const fileOptions = ctx.files.source[0];

							fs.readFile(fileOptions.path, (err, data) => {
								if (err) {
									return reject(err);
								}

								store[sourceId] = data;
								resolve(this);
							});
						});
					},
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