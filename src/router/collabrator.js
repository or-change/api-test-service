module.exports = function CollabratorRouter(router, { Authorize, Model }) {
	router.post('/', Authorize('collabrator.create'), async ctx => {
		ctx.body = await Model.Collabrator.create({
			projectId: ctx.state.project.id,
			accountId: ctx.request.body.accountId,
			inviter: ctx.principal.account.id
		});
	}).get('/', Authorize('collabrator.query'), async ctx => {
		ctx.body = ctx.state.collabratorList;
	}).param('collabratorId', async (collabratorId, ctx, next)=> {
		const collabrator = ctx.state.collabrator = await Model.Collabrator.query(collabratorId);
		
		if (!collabrator || collabrator.exitedAt !== null) {
			return ctx.throw(404, 'The collabrator is NOT existed.');
		}

		return next();
	}).get('/:collabratorId', Authorize('collabrator.get'), async ctx => {
		ctx.body = ctx.state.collabrator;
	}).delete('/:collabratorId',  Authorize('collabrator.delete'), async ctx => {
		const collabrator = ctx.state.collabrator;

		if (!collabrator) {
			return ctx.throw(404, 'Collabrator is not existed.');
		}

		ctx.body  = await collabrator.$update();
	});
};