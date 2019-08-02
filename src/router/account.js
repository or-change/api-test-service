module.exports = function ExecutionRouter(router, { Authorize, Model }) {
	router.get('/', Authorize('account.query'), async ctx => {

	}).put('/', Authorize('account.update'), async ctx => {

	}).param(':accountId', (accountId, ctx, next) => {

	}).get('/:accountId', Authorize('account.get'), async ctx => {

	});
};