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
const utils = require('./src/utils');

const Router = {
	Base: require('./src/router/base'),
	Admin: require('./src/router/admin'),
	Account: require('./src/router/account'),
	Project: require('./src/router/project'),
	Collabrator: require('./src/router/collabrator'),
	Source: require('./src/router/source'),
	Execution: require('./src/router/execution')
};

module.exports = function Examiner(originalOptions, factory = () => {}) {
	const options = normalize(originalOptions);
	const publicPath = path.resolve(options.server.public.path);
	const models = TestServiceModel(options.model);
	
	const Server = ProductKoaServer({
		factory(app, { Router, Session }) {
			app.use(serve(publicPath, {
				gzip: options.server.public.gzip,
				maxage: options.server.public.maxage
			}));
			app.use(koaBody({
				multipart: true
			}));
			Session.install(app);
			app.use(Router());
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
							},
							{
								prefix: '/:projectId/collabrator',
								Router: Router.Collabrator
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
						Router(router, { Registry }) {
							Registry.pluginRouterList.forEach(install => install(router));
						}
					}
				]
			})
		]
	});

	const registry = Registry();

	const product = Product({
		name: options.product.name,
		version: options.product.version,
		namespace: options.product.namespace,
		injection: {
			Model: models,
			temp: { path: options.temp.path },
			Registry: registry,
			authenticate(ctx) {
				return options.server.authenticate(ctx, models);
			},
			utils
		},
		Server,
	}, {
		beforeServer(injection) {
			const pluginList = [];
			const { Registry } = injection;
			const Tester = Registry.Tester();

			options.plugins.forEach(plugin => {
				pluginList.push({
					id: plugin.id,
					name: plugin.name,
					version: plugin.version,
					description: plugin.description
				});
				
				plugin.install(Registry.Register(), injection);
			});

			injection.Summary = function Summary() {
				return {
					plugins: pluginList,
					source: Object.keys(Tester.SourceAgent),
					executor: Object.keys(Tester.Executor),
					reporter: Object.keys(Tester.Reporter),
					scanner: Object.keys(Tester.Scanner)
				};
			};
		},
		afterServer(injection) {
			factory(injection);
		}
	});

	return {
		requestListener: product.requestListrner,
		webpack: product.Webpack({
			publicPath: '/',  //暂时修改
			entries: registry.webpackEntryList
		})
	};
};