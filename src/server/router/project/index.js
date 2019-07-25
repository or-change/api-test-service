const Router = require('koa-router');

const SourceRouter = require('./source');

module.exports = function ProjectRouter(Authorize) {
	const sourceRouter = SourceRouter(Authorize);

	return new Router({ prefix: '/project' })
		.get('/', Authorize('project.query'), async ctx => {

		})
		.post('/', Authorize('project.create'), async ctx => {

		})
		.param('projectId', async (projectId, ctx, next) => {

		})
		.post('/:projectId', Authorize('project.create'), async ctx => {

		})
		.put('/:projectId', Authorize('project.update'), async ctx => {

		})
		.delete('/:projectId', Authorize('project.delete'), async ctx => {

		})
		.use(sourceRouter.routes());
};