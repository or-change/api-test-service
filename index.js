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
const Scanner = require('./src/scanner');

const Router = {
	Base: require('./src/router/base'),
	Admin: require('./src/router/admin'),
	Account: require('./src/router/account'),
	Project: require('./src/router/project'),
	Source: require('./src/router/source'),
	Execution: require('./src/router/execution')
};

module.exports = function Examiner(originalOptions, factory = () => {}) {
	const options = normalize(originalOptions);
	const publicPath = path.resolve(options.server.serve.path);
	const models = TestServiceModel(options.model);
	
	const store = Registry.Store();
	const manager = Registry.Manager(store);
	const pluginList = [];
	
	const temp = { path: options.temp.path };

	options.plugins.forEach(plugin => {
		pluginList.push({
			id: plugin.id,
			name: plugin.name,
			version: plugin.version,
			description: plugin.description
		});
		
		plugin.install(manager, { temp, Model: models, Tester: store.Tester });
	});

	factory(manager);

	const Server = ProductKoaServer({
		factory(app, { Router, Session }) {
			app.use(koaBody({
				multipart: true
			}));
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
						Router: Router.Project,
						children: [
							{
								prefix: '/:projectId/source',
								Router: Router.Source,
								children: [
									{
										prefix: '/:sourceId/execution',
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
							store.pluginRouterList.forEach(install => install(router, injection));
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
			temp,
			scanner: Scanner(options.scanner),
			authenticate(ctx) {
				return options.server.authenticate(ctx, models);
			},
			summary: {
				plugins: pluginList,
				source: Object.keys(store.Tester.SourceAgent),
				executor: Object.keys(store.Tester.Executor),
				reporter: Object.keys(store.Tester.Reporter)
			}
		},
		Server,
		webapck: {
			entries: store.webpackEntryList,
			publicPath
		}
	});

	return product;
};