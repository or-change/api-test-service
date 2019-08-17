module.exports = function BaseRouter(router, {
	Authorize, authenticate, product, Model, Session, Summary
}) {
	const summary = Summary();

	router.get('/product', Authorize('product.query'), ctx => {
		ctx.body = {
			name: product.name,
			namespace: product.namespace,
			version: {
				product: product.version,
				core: '0.0.0'
			},
			plugins: summary.plugins,
			source: summary.source,
			reporter: summary.reporter,
			executor: summary.executor,
			scanner: summary.scanner,
		};
	}).post('/session/principal', Authorize('principal.create'), async (ctx) => {
		const success = await authenticate(ctx);

		if (!success) {
			return;
		}

		const { credential, accountId } = ctx.state.authentication;

		if (!credential || !accountId) {
			throw new Error('Invalid authenticate ret.');
		}

		const authedAt = Date.now();
		const account = await Model.Account.query(accountId);

		ctx.body = Session.set(ctx, 'principal', { authedAt, credential, account });
	}).use(async (ctx, next) => {
		const principal = await Session.get(ctx, 'principal');

		if (!principal) {
			return ctx.throw(403, 'Unauthenticated.');
		}

		ctx.principal = principal;

		return next();
	}).get('/session/principal', Authorize('principal.get'), ctx => {
		ctx.body = ctx.principal;
	}).delete('/session/principal', Authorize('principal.delete'), async ctx => {
		ctx.body = ctx.principal;
		await Session.destroy(ctx);
	});
};