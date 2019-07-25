const Router = require('koa-router');

const AccountRouter = require('./account');
const AdminRouter = require('./admin');
const ProjectRouter = require('./project');

module.exports = function BaseRouter(Middleware) {
	const { Authorize, Authenticate } = Middleware;
	
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
					product: ctx.$product.version,
					core: '0.0.0',
				}
			};
		})
		.post('/session/principal',
			Authorize('session.signin'),
			Authenticate(),
			ctx => ctx.body = ctx.principal
		)
		.use(Authenticate())
		.get('/session/principal',
			Authorize('session.account'),
			ctx => ctx.body = ctx.principal
		)
		.delete('/session/principal',
			Authorize('session.signout'),
			async ctx => {
				ctx.body = ctx.principal;
				await ctx.$session.destroy(ctx);
			}
		)
		.use(router.project.routes())
		.use(router.admin.routes())
		.use(router.account.routes());
};