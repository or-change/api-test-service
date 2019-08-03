const path = require('path');
const koaBody = require('koa-body');
const serve = require('koa-static');

const Product = require('./lib/product');
const ProductKoaServer = require('./lib/product-koa-server');

const AccessControlPlugin = require('./lib/access-control-plugin');
const KoaRouterPlugin = require('./lib/koa-router-plugin');
const SessionPlugin = require('./lib/session-plugin');

const TestServiceModel = require('./src/models');
const Registry = require('./src/registry');
const Authorizer = require('./src/authorizer');
const normalize = require('./src/normalize');

const Router = {
	Base: require('./src/router/base'),
	Admin: require('./src/router/admin'),
	Account: require('./src/router/account'),
	Product: require('./src/router/project'),
	Source: require('./src/router/source'),
	Execution: require('./src/router/execution')
};

module.exports = function TestingService(originalOptions, factory = () => {}) {
	const options = normalize(originalOptions);
	const publicPath = path.resolve(options.server.serve.path);
	const models = TestServiceModel(options.model);
	
	const store = new Registry.Store();
	const manager = new Registry.Manager(store);

	options.plugins.forEach(plugin => {
		store.pluginRouterList.push({
			name: plugin.name,
			version: plugin.version,
			description: plugin.description
		});
		
		plugin.install(manager);
	});

	factory(manager);

	const Server = ProductKoaServer({
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
			SessionPlugin({
				manual: false,
				install: options.server.session.install,
				destroy: options.server.session.destroy,
				get: options.server.session.get,
				set: options.server.session.set
			}),
			AccessControlPlugin({
				authorize: Authorizer()
			}),
			KoaRouterPlugin({
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
							store.pluginRouterList.forEach(PluginRouter => {
								router.use(PluginRouter(injection).routes());
							});
						}
					}
				]
			})
		]
	});

	const product = Product({
		name: options.product.name,
		version: options.product.version,
		namespace: options.product.namespace,
		injection: {
			Tester: store.Tester,
			Model: models,
			authenticate: options.server.authenticate
		},
		Server,
		webapck: {
			entries: store.webpackEntryList,
			publicPath
		}
	});

	return product;
};