exports.Manager = function Registry({ Tester, pluginRouterList, webpackEntryList }) {
	return {
		executor(name, execute) {
			return Tester.Executor[name] = execute;
		},
		sourceAgent(name, factory) {
			return Tester.SourceAgent[name] = factory;
		},
		reporter(name, factory) {
			return Tester.Reporter[name] = factory;
		},
		router(Router) {
			pluginRouterList.push(Router);

			return Router;
		},
		entry(pathname) {
			webpackEntryList.push(pathname);
		}
	};
};

exports.Store = function Store() {
	return {
		pluginRouterList: [],
		webpackEntryList: [],
		Tester: {
			Executor: {},
			SourceAgent: {},
			Reporter: {}
		}
	};
};