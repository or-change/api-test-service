const Router = require('koa-router');

module.exports = [
	require('./account'),
	require('./administrator'),
	require('./project')
].reduce((base, router) => {
	return base.use(router.routes());
}, new Router().get('/product', ctx => {
	ctx.body = {
		name: ctx.$product.name,
		version: {
			core: '0.0.0',
			product: '1.0.0'
		}
	};
}).post('/session/account', async ctx => {
	const principal = await ctx.$session.authenticate(ctx);

	if (!principal) {
		return ctx.throw(401);
	}

	ctx.body = principal.account;
}).use(async (ctx, next) => {
	const principal = await ctx.$session.getPrincipal(ctx);

	if (!principal) {
		return ctx.throw(403);
	}

	ctx.account = principal.account;

	return next();
}).get('/session/account', async ctx => {
	ctx.body = ctx.principal;
}).delete('/session/account', async ctx => {
	ctx.body = await ctx.$session.destroy(ctx);
}));
