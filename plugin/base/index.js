const path = require('path');
const fs = require('fs');

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
		install: function BasicSuitePluginInstall(product, { temp, Tester }) {
			product.executor('basic.local', function BaseLocalExecutor(sourceAgent) {
				
			});

			product.sourceAgent('basic.local', async function BasicLocalSourceAgent(sourceId) {
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
	
			product.entry(path.join(__dirname, 'app/index.js'));
		}
	};
};