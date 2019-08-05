const path = require('path');

const abstract = {
	name: 'Testing Service Basic Tester Suite',
	id: 'com.oc.base',
	version: '1.0.0',
	description: 'Basic functions for getting started.',
};

module.exports = function BasicSuitePluginProvider() {
	return Object.assign({}, abstract, {
		install: function BasicSuitePluginInstall(product) {
			product.scanner('base.scanner.local', function BaseLocalScanner() {
	
			});
	
			product.executor('base.executor.local', function BaseLocalExecutor() {
	
			});
	
			product.sourceAgent('base.sourceAgent.fs', function BaseFSSourceAgent() {
	
			});
	
			product.reporter('base.report.html', function BaseReporterHtml() {
	
			});
	
			product.entry(path.join(__dirname, 'app/index.js'));
		}
	});
};