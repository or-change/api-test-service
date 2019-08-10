const koa = require('koa');
const koaBody = require('koa-body');
const Router = require('koa-router');
const TdkParser = require('@or-change/tdk/parser');

module.exports = function ObserverServer(manager) {
	const router = new Router({
		prefix: '/:sessionId'
	}).param('sessionId', (sessionId, ctx, next) => {
		const session = manager.store[sessionId];

		if (!session) {
			return ctx.throw(403);
		}

		ctx.state.session = session;
		
		return next();
	}).post('/log', async ctx => {
		const logList = ctx.request.body;
		const result = [];

		const parser = TdkParser({
			on: {
				fail(path) {
					result.push(path);
				}
			}
		});

		logList.forEach(log => parser.write(log.message));

		await ctx.state.session.execution.$update({
			log: logList,
			status: 3,
			endedAt: new Date(),
			result
		});

		ctx.body = 'ok';
	}).post('/ready', async ctx => {
		const structure = ctx.request.body;
		
		ctx.state.session.structure = structure;

		await ctx.state.session.execution.$update({
			progress: { length: structure.total }
		});

		ctx.body = 'ok';
	}).get('/progress/:ended', async ctx => {
		await ctx.state.session.execution.$update({
			progress: {
				ended: ctx.params.ended
			}
		});

		ctx.body = 'ok';
	});

	return new koa().use(koaBody()).use(router.routes()).listen();
};