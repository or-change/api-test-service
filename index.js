const Webpack = require('./src/webpack');
const Server = require('./src/server');
const merge = require('webpack-merge');

const Source = require('./src/plugin/source');
const Reporter = require('./src/plugin/reporter');
const Executer = require('./src/plugin/executor');

exports.create = function Product(options) {
	const webpack = Webpack();
	
	const component = {
		source: {},
		reporter: {},
		executer: {},
		routers: [],
		entryList: []
	};

	const context = {
		source(name, options) {
			component.source[name] = new Source(options);
		},
		reporter(name, options) {
			component.reporter[name] = new Reporter(options);
		},
		executer(name, options) {
			component.executer[name] = new Executer(options);
		},
		router: {
			append(router) {
				component.routers.push(router);
			}
		}
	};

	options.plugins.forEach(install => install(context));

	const server = Server(options.server, component.routers);
	
	server.context.$product = {
		reporter: component.reporter,
		source: component.source,
		executer: component.executer
	};

	return {
		webpack,
		callback: server.callback()
	};
};