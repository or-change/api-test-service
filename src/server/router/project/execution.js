const Router = require('koa-router');
const ReportRouter = require('./report');

module.exports = function ExecutionRouter(Middleware) {
	const { Authorize } = Middleware;
	const reportRouter = ReportRouter(Middleware);

	return new Router({ prefix: '/execution' })
		.get('/', Authorize('execution.query'), async ctx => {

		})
		.post('/', Authorize('execution.create'), async ctx => {

		})
		.param(':executionId', (executionId, ctx, next) => {

		})
		.get('/:executionId', Authorize('execution.get'), async ctx => {

		})
		.delete('/:executionId', Authorize('execution.delete'), async ctx => {

		})
		.use(reportRouter.routes());
};