const Router = require('koa-router');
const ExecutionRouter = require('./execution');

module.exports = function AdminRouter(Authorize) {
	const executionRouter = ExecutionRouter(Authorize);

	return new Router({ prefix: '/source' })
		.get('/', Authorize('source.query'), async ctx => {

		})
		.post('/', Authorize('source.create'), async ctx => {

		})
		.param('sourceId', (sourceId, ctx, next) => {

		})
		.get('/sourceId', Authorize('source.get'), async ctx => {

		})
		.put('/sourceId', Authorize('source.update'), async ctx => {

		})
		.delete('/sourceId', Authorize('source.delete'), async ctx => {

		})
		.use(executionRouter.routes());
};