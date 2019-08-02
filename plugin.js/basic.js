module.exports = {
	name: 'com.oc.base',
	version: '1.0.0',
	description: 'Basic functions for getting started.',
	Provider: function BasePluginProvider(tester) {
		tester.scanner('base.scanner.local', function BaseLocalScanner() {

		});

		tester.executor('base.executor.local', function BaseLocalExecutor() {

		});

		tester.sourceAgent('base.sourceAgent.fs', function BaseFSSourceAgent() {

		});

		tester.reporter('base.report.html', function BaseReporterHtml() {

		});
	}
};