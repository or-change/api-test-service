'use strict';

module.exports = function Registry() {
	const store = {
		pluginRouterList: [],
		webpackEntryList: [],
		Tester: {
			Executor: {},
			SourceAgent: {},
			Reporter: {},
			Scanner: {}
		}
	};

	return {
		Register() {
			return {
				executor(name, execute) {
					return store.Tester.Executor[name] = execute;
				},
				sourceAgent(name, factory) {
					return store.Tester.SourceAgent[name] = factory;
				},
				reporter(name, factory) {
					return store.Tester.Reporter[name] = factory;
				},
				scanner(name, factory) {
					return store.Tester.Scanner[name] = factory;
				},
				router(Router) {
					store.pluginRouterList.push(Router);
				},
				entry(pathname) {
					store.webpackEntryList.push(pathname);
				}
			};
		},
		Tester() {
			return {
				get Executor() {
					return Object.assign({}, store.Tester.Executor);
				},
				get SourceAgent() {
					return Object.assign({}, store.Tester.SourceAgent);
				},
				get Reporter() {
					return Object.assign({}, store.Tester.Reporter);
				},
				get Scanner() {
					return Object.assign({}, store.Tester.Scanner);
				}
			};
		},
		get webpackEntryList() {
			return store.webpackEntryList.slice(0);
		},
		get pluginRouterList() {
			return store.pluginRouterList.slice(0);
		}
	};
};