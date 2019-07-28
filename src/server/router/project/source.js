const Router = require('koa-router');
const ExecutionRouter = require('./execution');
const fs = require('fs');

module.exports = function AdminRouter(Middleware) {
	const { Authorize } = Middleware;
	const executionRouter = ExecutionRouter(Middleware);

	return new Router({ prefix: '/source' })
		.get('/', Authorize('source.query'), async ctx => {
			ctx.body = await ctx.$model.SourceList.query({
				projectId: ctx.state.project.id
			});
		})
		.post('/', Authorize('source.create'), async ctx => {
			const { sourceType } = ctx.query;
			const { semver } = ctx.request.body;

			const SourceAgent = ctx.project.source[sourceType];

			if (!SourceAgent) {
				return ctx.throw(400, `Unsupported source type ${sourceType}.`);
			}

			const sourceAgent = new sourceAgent(ctx);

			(async function () {
				
			}());
			//TODO 拉内容
			//TODO 缓存内容
			//TODO 分析内容 Scan
			//TODO 更新分析结果

			ctx.body = await ctx.$model.Source.create({ semver });
		})
		.param('sourceId', async (sourceId, ctx, next) => {
			const { project } = ctx.state;
			const source = await ctx.$model.Source.query({
				projectId: project.id,
				sourceId
			});

			if (!source) {
				return ctx.throw(404, 'Source is NOT found.');
			}

			ctx.state.source = source;
			
			return next();
		})
		.get('/:sourceId', Authorize('source.get'), async ctx => {

		})
		.delete('/:sourceId', Authorize('source.delete'), async ctx => {

		})
		.get('/:sourceId/pack', Authorize('source.pack.get'), async ctx => {

		})
		.use(executionRouter.routes());
};