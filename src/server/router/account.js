const Router = require('koa-router');

module.exports = function ExecutionRouter(Middleware) {
	const { Authorize } = Middleware;

	return new Router({ prefix: '/account' })
		.get('/', Authorize('account.query'), async ctx => {

		})
		.put('/', Authorize('account.update'), async ctx => {

		})
		.param(':accountId', (accountId, ctx, next) => {

		})
		.get('/:accountId', Authorize('account.get'), async ctx => {

		});
};