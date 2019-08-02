module.exports = function ExecutionRouter(router, { Authorize, Model, Tester }) {
	router.get('/', Authorize('execution.query'), async ctx => {
		const { project, source } = ctx.state;

		return Model.ExecutionList.query({
			projectId: project.id,
			sourceId: source.id
		});
	}).post('/', Authorize('execution.create'), async ctx => {
		const { project, source } = ctx.state;
		const { executor: executorType } = ctx.query;
		const execute = Tester.Executor[executorType];

		if (!execute) {
			return ctx.throw(400, `Unsupported executor type ${executorType}.`);
		}

		const SourceAgent = Tester.SourceAgent[source.agent];
		
		if (!SourceAgent) {
			return ctx.throw(422, `Source agent '${source.agent}' is NOT available.`);
		}

		const sourceAgent = await SourceAgent.from(source.id);
		const execution = ctx.body = await Model.Execution.create({
			projectId: project.id,
			sourceId: source.id
		});
		
		execute({ source: sourceAgent, model: execution });
	}).param(':executionId', (executionId, ctx, next) => {
		const { project, source } = ctx.state;
		const execution = Model.Execution.query({
			executionId,
			projectId: project.id,
			sourceId: source.id,
		});

		if (!execution) {
			return ctx.throw(404, 'Execution is NOT found.');
		}

		ctx.state.execution = execution;

		return next();
	}).get('/:executionId', Authorize('execution.get'), async ctx => {
		ctx.body = ctx.state.execution;
	}).delete('/:executionId', Authorize('execution.delete'), async ctx => {
		ctx.body = await ctx.state.execution.$delete();
	}).get('/:executionId/report/:reporterType', async ctx => {
		const { project, source, execution } = ctx.state;
		const { reporterType: type } = ctx.params;
		const { Reporter } = Tester.Reporter[type];

		if (!Reporter) {
			return ctx.throw(404, `Report type is '${type}' is NOT found.`);
		}
		
		if (execution.endedAt === null) {
			return ctx.throw(412, 'Execution is NOT finished.');
		}

		return Reporter.get({ project, source, execution });
	});
};