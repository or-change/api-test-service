const session = require('koa-session');
const path = require('path');

module.exports = function normalizeServerOptions(options) {
	const finalOptions = {
		Session(app) {
			app.keys = [Math.random().toString(16).substr(2, 8)];
			app.use(session(app));

			return {
				async authenticate(ctx) {
					const { credentials } = ctx.query;
					const principal = await ctx.$model.Principal.query({
						[credentials]: ctx.request.body
					});

					ctx.session.principal = {
						account: principal.account,
						credentials,
						at: Date.now()
					};
				},
				destroy(ctx) {
					return ctx.session = null;
				},
				getAccount(ctx) {
					return ctx.session.principal.account;
				}
			};
		},
		serve: {
			path: path.resolve('.public'),
			maxage: 0,
			setHeaders: null
		}
	};

	const {
		Session = finalOptions.Session,
		serve = finalOptions.serve
	} = options;

	if (typeof Session !== 'function') {
		throw new Error('Session MUST be a function.');
	}

	
};