const Koa = require('koa');
const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const serve = require('koa-static');
const path = require('path');

const Model = require('./models');
const BaseRouter = require('./router');

module.exports = function Server(options, pluginRouters) {
	const app = new Koa();
	const baseRouter = BaseRouter(options.Authorize);
	const apiRouter = new Router({
		prefix: '/api'
	}).use(baseRouter.routes());

	app.context.$Model = Model(options.model);
	app.context.$session = options.Session(app);
	
	const pluginRouter = new Router({ prefix: '/plugin' });
	
	pluginRouters.forEach(router => pluginRouter.use(router.routes()));
	apiRouter.use(pluginRouter.routes());
	
	app.use(bodyparser());
	app.use(apiRouter.routes());
	app.use(serve(path.resolve(options.serve.path), {
		gzip: options.serve.gzip,
		maxage: options.serve.maxage
	}));

	return app;
};