const Webpack = require('./src/webpack');
const Server = require('./src/server');

const Source = require('./src/plugin/source');
const Reporter = require('./src/plugin/reporter');
const Executer = require('./src/plugin/executor');

const path = require('path');

function normalize(options) {
	return {
		plugins: [],
		server: {
			model: {
				store: {
					pattern: {
						hash: /.*/
					}
				}
			},
			Session(app) {

			},
			serve: {
				path: path.resolve()
			}
		}
	};
}

exports.create = function Product(originOptions) {
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
		router: {
			append(router) {
				component.routers.push(router);
			}
		}
	};

	options.plugins.forEach(install => install(context));

	const app = Server(options.server, component.routers);
	
	app.context.$product = {
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