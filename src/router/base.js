module.exports = function BaseRouter(router, { Authorize, authenticate, product, Model, Session }) {
	router.get('/product', Authorize('product.query'), ctx => {
		ctx.body = {
			name: product.abstract.name,
			version: {
				product: product.abstract.version,
				core: product.core.version,
				plugins: {}
			},
			source: [],
			reporter: [],
			executer: [],
			scanner: []
		};
	}).post('/session/principal', Authorize('principal.create'), async (ctx) => {
		const { credential, accountId } = await authenticate(ctx);
		const authedAt = Date.now();
		const account = await Model.Account.query(accountId);

		Session.set(ctx, 'principal', { authedAt, credential, account });
	}).use(async (ctx, next) => {
		const principal = await Session.get(ctx, 'principal');

		if (!principal) {
			return ctx.throw(403);
		}

		ctx.principal = principal;

		return next();
	}).get('/session/principal', Authorize('principal.query'), ctx => {
		ctx.body = ctx.principal;
	}).delete('/session/principal', Authorize('principal.delete'), async ctx => {
		ctx.body = ctx.principal;
		await Session.destroy(ctx);
	});
};