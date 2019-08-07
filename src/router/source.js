const fs = require('fs');

module.exports = function SourceRouter(router, { Authorize, Model, Tester }) {
	async function parseStructure(agent) {

	}

	router.get('/', Authorize('source.query'), async ctx => {
		const { project } = ctx.state;

		ctx.body = await Model.SourceList.query({
			selector: 'projectId',
			args: {
				projectId: project.id
			}
		});
	}).post('/', Authorize('source.create'), async ctx => {
		const { project } = ctx.state;
		const { semver, agent: type } = ctx.request.body;
		const SourceAgent = Tester.SourceAgent[type];

		if (!SourceAgent) {
			return ctx.throw(400, `Unsupported source type ${type}.`);
		}

		ctx.body = await Model.Source.create({
			semver,
			projectId: project.id,
			agent: type
		});
	}).param('sourceId', async (sourceId, ctx, next) => {
		const { project } = ctx.state;
		const source = await Model.Source.query({
			projectId: project.id,
			sourceId
		});

		if (!source) {
			return ctx.throw(404, 'Source is NOT found.');
		}

		ctx.state.source = source;
		
		return next();
	}).get('/:sourceId', Authorize('source.get'), async ctx => {
		ctx.body = ctx.state.source;
	}).delete('/:sourceId', Authorize('source.delete'), async ctx => {
		ctx.body = await ctx.state.source.$delete();
	}).get('/:sourceId/pack', Authorize('source.pack.get'), async ctx => {
		const { source } = ctx.state;
		const SourceAgent = Tester.SourceAgent[source.agent];

		if (!SourceAgent) {
			return ctx.throw(400, `Unsupported source type ${source.agent}.`);
		}

		const agent = new SourceAgent(source.id);

		if (!agent) {
			return ctx.throw(410, 'Source pack is gone.');
		}

		ctx.body = await agent.fetch();
		ctx.type = 'application/zip';
		ctx.set({
			'Content-Disposition': `attachment; filename=${source.id}_${source.semver}.zip`
		});
	});
};