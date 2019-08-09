module.exports = function ExecutionRouter(router, { Authorize, Model, Tester }) {
	router.get('/', Authorize('execution.query'), async ctx => {
		ctx.body = await Model.ExecutionList.query({
			selector: 'sourceId',
			args: {
				sourceId: ctx.state.source.id
			}
		});
	}).post('/', Authorize('execution.create'), async ctx => {
		const { source } = ctx.state;
		const { executor: type } = ctx.request.body;
		const execute = Tester.Executor[type];

		if (!execute) {
			return ctx.throw(400, `Unsupported executor type ${type}.`);
		}

		const SourceAgent = Tester.SourceAgent[source.agent];
		
		if (!SourceAgent) {
			return ctx.throw(422, `Source agent '${source.agent}' is NOT available.`);
		}

		ctx.body = await Model.Execution.create({
			sourceId: source.id,
			executor: type
		});
	}).param('executionId', async (executionId, ctx, next) => {
		const execution = await Model.Execution.query({ executionId });

		if (!execution || execution.sourceId !== ctx.state.source.id) {
			return ctx.throw(404, 'Execution is NOT found.');
		}

		ctx.state.execution = execution;

		return next();
	}).get('/:executionId', Authorize('execution.get'), async ctx => {
		ctx.body = ctx.state.execution;
	}).delete('/:executionId', Authorize('execution.delete'), async ctx => {
		ctx.body = await ctx.state.execution.$delete();
	}).get('/:executionId/report/:type', Authorize('execution.report.get'), async ctx => {
		const { project, source, execution } = ctx.state;
		const { type } = ctx.params;
		const { Reporter } = Tester.Reporter[type];

		if (!Reporter) {
			return ctx.throw(400, `Reporter type is '${type}' is NOT defined.`);
		}
		
		if (execution.endedAt === null) {
			return ctx.throw(412, 'Execution is NOT finished.');
		}

		return Reporter.get({ project, source, execution });
	});
};