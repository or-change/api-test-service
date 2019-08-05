module.exports = function ProjectRouter(router, { Authorize, Model }) {
	router.get('/', Authorize('project.query'), async ctx => {
		const projectList = await Model.ProjectList.query({
			selector: 'ownerId',
			args: {
				ownerId: ctx.principal.account.id
			}
		});

		ctx.body = projectList.$data;
	}).post('/', Authorize('project.create'), async ctx => {
		const { name } = ctx.request.body;

		const project = await Model.Project.create({
			name,
			ownerId: ctx.principal.account.id
		});

		ctx.body = project.$data;
	}).param('projectId', async (projectId, ctx, next) => {
		const project = await Model.Project.query(projectId);

		if (!project) {
			return ctx.throw(404, 'Project is NOT found.');
		}

		ctx.state.project = project;
		
		return next();
	}).get('/:projectId', Authorize('project.get'), async ctx => {
		ctx.body = ctx.state.project.$data;
	}).put('/:projectId', Authorize('project.update'), async ctx => {
		const { project } = ctx.state;

		await project.$update({ name: ctx.request.body.name });
		ctx.body = project.$data;
	}).delete('/:projectId', Authorize('project.delete'), async ctx => {
		const { project } = ctx.state;
		
		await project.$delete();
		ctx.body = project.$data;
	});
};