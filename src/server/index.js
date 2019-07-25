const Koa = require('koa');
const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const serve = require('koa-static');
const path = require('path');

const Model = require('./models');
const BaseRouter = require('./router');

module.exports = function Server(options, pluginRouters) {
	const Middleware = {
		Authorize(symbol) {
			return async function authorize(ctx, next) {
				if (await options.authorize(symbol, ctx)) {
					return next();
				}
			};
		},
		Authenticate() {
			return async function authenticate(ctx, next) {
				if (await options.authenticate(ctx)) {
					ctx.$session.set('principal', ctx.principal);

					return next();
				}
			};
		}
	};

	const app = new Koa();
	const baseRouter = BaseRouter(Middleware);
	const apiRouter = new Router({ prefix: '/api' }).use(baseRouter.routes());

	app.context.$Model = Model(options.model);
	options.session.install(app);
	
	const pluginRouter = new Router({ prefix: '/plugin' });
	
	pluginRouters.forEach(router => pluginRouter.use(router.routes()));
	apiRouter.use(pluginRouter.routes());
	
	return app
		.use(bodyparser())
		.use(function session(ctx, next) {
			ctx.$session = {
				destroy() {
					return options.session.destroy(ctx);
				},
				set(key, value) {
					return options.session.set(ctx, key, value);
				},
				get(key) {
					return options.session.get(ctx, key);
				}
			};

			return next();
		})
		.use(apiRouter.routes())
		.use(serve(path.resolve(options.serve.path), {
			gzip: options.serve.gzip,
			maxage: options.serve.maxage
		}));
};