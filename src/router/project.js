module.exports = function ProjectRouter(router, { Authorize, Model }) {
	router.get('/', Authorize('project.query'), async ctx => {
		ctx.body = await Model.ProjectList.query({
			ownerId: ctx.principal.account.id
		});
	}).post('/', Authorize('project.create'), async ctx => {
		const options = ctx.request.body;

		ctx.body = await Model.Project.create({
			name: options.name,
			ownerId: ctx.principal.account.id
		});
	}).param('projectId', async (projectId, ctx, next) => {
		const project = await Model.Project.query(projectId);

		if (!project) {
			return ctx.throw(404, 'Project is NOT found.');
		}

		ctx.state.project = project;
		
		return next();
	}).post('/:projectId', Authorize('project.get'), async ctx => {
		ctx.body = ctx.project;
	}).put('/:projectId', Authorize('project.update'), async ctx => {
		const options = ctx.request.body;

		ctx.body = await ctx.project.$update({
			name: options.name,
		});
	}).delete('/:projectId', Authorize('project.delete'), async ctx => {
		ctx.body = await ctx.project.$delete();
	});
};