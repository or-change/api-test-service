const Router = require('koa-router');
const ExecutionRouter = require('./execution');

module.exports = function AdminRouter(Middleware) {
	const { Authorize } = Middleware;
	const executionRouter = ExecutionRouter(Middleware);

	return new Router({ prefix: '/source' })
		.get('/', Authorize('source.query'), async ctx => {
			const { project } = ctx.state;

			ctx.body = await ctx.$model.SourceList.query({
				projectId: project.id
			});
		})
		.post('/', Authorize('source.create'), async ctx => {
			const { agentType } = ctx.query;
			const { semver } = ctx.request.body;

			const Agent = ctx.$product.source[agentType];

			if (!Agent) {
				return ctx.throw(400, `Unsupported source type ${agentType}.`);
			}

			const agent = new Agent(ctx);
			const source = ctx.body = await ctx.$model.Source.create({ semver });

			(async function () {
				await agent.fetch();
				const sturcture = await agent.scan();

				await source.$update({ sturcture });
			}());
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
			ctx.body = ctx.state.source;
		})
		.delete('/:sourceId', Authorize('source.delete'), async ctx => {
			ctx.body = await ctx.state.source.delete();
		})
		.get('/:sourceId/pack', Authorize('source.pack.get'), async ctx => {
			const { source } = ctx.state;
			const agentType = source.agent;
			const Agent = ctx.$product.source[agentType];
			
			if (!Agent) {
				return ctx.throw(422, `Source agent '${agentType}' is NOT available.`);
			}

			const agent = await Agent.from(source.id);

			if (!agent) {
				return ctx.throw(410, 'Source pack is gone.');
			}

			ctx.body = await agent.fetch();
			ctx.type = 'application/zip';
			ctx.set({
				'Content-Disposition': `attachment; filename=${source.id}_${source.semver}.zip`
			});
		})
		.use(executionRouter.routes());
};