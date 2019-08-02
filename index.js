const path = require('path');
const koaBody = require('koa-body');
const serve = require('koa-static');

const Product = require('./lib/product');
const ProductKoaServer = require('./lib/product-koa-server');

const AccessControlPlugin = require('./lib/access-control-plugin');
const ApiRouterPlugin = require('./lib/koa-router-plugin');
const SessionPlugin = require('./lib/session-plugin');

const TestServiceModel = require('./src/models');
const normalize = require('./src/normalize');

const Router = {
	Base: require('./src/router/base'),
	Admin: require('./src/router/admin'),
	Account: require('./src/router/account'),
	Product: require('./src/router/project'),
	Source: require('./src/router/source'),
	Execution: require('./src/router/execution')
};

module.exports = function TestingService(originalOptions) {
	const options = normalize(originalOptions);
	const publicPath = path.resolve(options.server.publicPath);
	const models = TestServiceModel(options.model);
	
	const pluginRouterList = [];
	const Tester = {
		Scanner: {},
		Executor: {},
		SourceAgent: {},
		Reporter: {},
		plugins: []
	};

	const registry = {
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
		}
	};

	options.plugins.forEach(plugin => {
		pluginRouterList.push({
			name: plugin.name,
			version: plugin.version,
			description: plugin.description
		});
		
		plugin.Provider(registry);
	});

	return Product({
		name: options.product.name,
		version: options.product.version,
		namespace: options.product.namespace,
		Server: ProductKoaServer({
			injection: {
				Tester,
				Model: models,
				authenticate: options.server.authenticator
			},
			factory(app, { Router, Session }) {
				app.use(koaBody());
				Session.install(app);
				app.use(Router());
				app.use(serve(publicPath, {
					gzip: options.server.serve.gzip,
					maxage: options.server.serve.maxage
				}));
			},
			plugins: [
				ApiRouterPlugin({
					prefix: '/api',
					Router: Router.Base,
					children: [
						{
							prefix: '/project',
							Router: Router.Product,
							children: [
								{
									prefix: '/source',
									Router: Router.Source,
									children: [
										{
											prefix: '/execution',
											Router: Router.Execution
										}
									]
								}
							]
						},
						{
							prefix: '/admin',
							Router: Router.Admin
						},
						{
							prefix: '/account',
							Router: Router.Account
						},
						{
							prefix: '/plugin',
							Router(router, injection) {
								pluginRouterList.forEach(PluginRouter => {
									router.use(PluginRouter(injection).routes());
								});
							}
						}
					]
				}),
				AccessControlPlugin({
					authorize(symbol, ctx) {
						return options.server.authorize(symbol, ctx, models);
					}
				}),
				SessionPlugin({
					manual: false,
					install: options.server.session.install,
					destroy: options.server.session.destroy,
					get: options.server.session.get,
					set: options.server.session.set
				})
			]
		})
	});
};