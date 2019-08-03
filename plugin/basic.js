module.exports = {
	name: 'com.oc.base',
	version: '1.0.0',
	description: 'Basic functions for getting started.',
	install: function BasePluginProvider(product) {
		product.scanner('base.scanner.local', function BaseLocalScanner() {

		});

		product.executor('base.executor.local', function BaseLocalExecutor() {

		});

		product.sourceAgent('base.sourceAgent.fs', function BaseFSSourceAgent() {

		});

		product.reporter('base.report.html', function BaseReporterHtml() {

		});
	}
};