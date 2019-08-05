exports.Manager = function Registry({ Tester, pluginRouterList, webpackEntryList }) {
	return {
		scanner(name, factory) {
			return Tester.Scanner[name] = factory;
		},
		executor(name, factory) {
			return Tester.Executor[name] = factory;
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
			Scanner: {},
			Executor: {},
			SourceAgent: {},
			Reporter: {}
		}
	};
};