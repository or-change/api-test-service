const Router = require('koa-router');

const AccountRouter = require('./account');
const AdminRouter = require('./admin');
const ProjectRouter = require('./project');

module.exports = function BaseRouter(Middleware) {
	const { Authorize, Authenticate } = Middleware;
	
	const router = {
		project: ProjectRouter(Middleware),
		admin: AdminRouter(Middleware),
		account: AccountRouter(Middleware)
	};

	return new Router()
		.get('/product', Authorize('product'), ctx => {
			ctx.body = {
				name: ctx.$product.abstract.name,
				version: {
					product: ctx.$product.abstract.version,
					core: ctx.$product.core.version,
					plugins: {}
				},
				source: [],
				reporter: [],
				executer: [],
				scanner: []
			};
		})
		.post('/session/principal', Authorize('session.signin'), Authenticate())
		.use(async (ctx, next) => {
			const principal = await ctx.$session.get('principal');

			if (!principal) {
				return ctx.throw(403);
			}

			ctx.principal = principal;

			return next();
		})
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