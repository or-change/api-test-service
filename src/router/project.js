module.exports = function ProjectRouter(router, { Authorize, Model }) {
	router.get('/', Authorize('project.query'), async ctx => {
		ctx.body = await Model.ProjectList.query({
			selector: 'memberOf',
			args: {
				memberId: ctx.principal.account.id
			}
		});
	}).post('/', Authorize('project.create'), async ctx => {
		const { name } = ctx.request.body;

		ctx.body = await Model.Project.create({
			name,
			ownerId: ctx.principal.account.id
		});
	}).param('projectId', async (projectId, ctx, next) => {
		const project = await Model.Project.query(projectId);

		if (!project) {
			return ctx.throw(404, 'Project is NOT found.');
		}

		ctx.state.project = project;
		ctx.state.collabratorList = await Model.CollabratorList.query({
			selector: 'projectId',
			args: {
				projectId: ctx.state.project.id
			}
		});
		
		return next();
	}).get('/:projectId', Authorize('project.get'), async ctx => {
		ctx.body = ctx.state.project;
	}).put('/:projectId', Authorize('project.update'), async ctx => {
		const { name } = ctx.request.body;

		if (typeof name !== 'string') {
			return ctx.throw(400);
		}

		ctx.body = await ctx.state.project.$update({ name });
	}).delete('/:projectId', Authorize('project.delete'), async ctx => {
		ctx.body = await ctx.state.project.$delete();
	});
};