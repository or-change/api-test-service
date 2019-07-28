const Webpack = require('./src/webpack');
const Server = require('./src/server');
const _package = require('./package.json');

const Source = require('./src/plugin/source');
const Reporter = require('./src/plugin/reporter');
const Executer = require('./src/plugin/executor');
const normalize = require('./src/normalize');

exports.create = function Product(originOptions, callback = () => {}) {
	const options = normalize(originOptions);

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
		scanner(name, options) {

		},
		router(router) {
			component.routers.push(router);
		}
	};

	options.plugins.forEach(install => install(context));
	callback(context);

	const app = Server(options.server, component.routers);
	
	app.context.$product = {
		core: {
			version: _package.version
		},
		abstract: {
			name: options.product.name,
			version: options.product.version,
		},
		reporter: component.reporter,
		source: component.source,
		executer: component.executer
	};

	const webpack = Webpack(component.entryList);

	return {
		webpack,
		callback: app.callback()
	};
};