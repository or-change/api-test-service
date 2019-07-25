const Router = require('koa-router');

const AccountRouter = require('./account');
const AdminRouter = require('./admin');
const ProjectRouter = require('./project');

module.exports = function BaseRouter(Authorize) {
	const router = {
		project: ProjectRouter(Authorize),
		admin: AdminRouter(Authorize),
		account: AccountRouter(Authorize)
	};

	return new Router()
		.get('/product', Authorize('product'), ctx => {
			ctx.body = {
				name: ctx.$product.name,
				version: {
					core: '0.0.0',
					product: '1.0.0'
				}
			};
		})
		.post('/session/account', Authorize('session.signin'), async ctx => {
			const principal = await ctx.$session.authenticate(ctx);
		
			if (!principal) {
				return ctx.throw(401);
			}
		
			ctx.body = principal.account;
		})
		.use(async (ctx, next) => {
			const principal = await ctx.$session.getPrincipal(ctx);
		
			if (!principal) {
				return ctx.throw(403);
			}
		
			ctx.account = principal.account;
		
			return next();
		})
		.get('/session/account', Authorize('session.account'), async ctx => {
			ctx.body = ctx.principal;
		})
		.delete('/session/account', Authorize('session.signout'), async ctx => {
			ctx.body = await ctx.$session.destroy(ctx);
		})
		.use(router.project.routes())
		.use(router.admin.routes())
		.use(router.account.routes());
};