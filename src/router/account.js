module.exports = function ExecutionRouter(router, { Authorize, Model }) {
	router.get('/', Authorize('account.query'), async ctx => {
		ctx.body = Model.AccountList.query({
			selector: 'name',
			args: {
				name: ctx.query.name
			}
		});
	}).param(':accountId', (accountId, ctx, next) => {
		const account = Model.Account.query(accountId);

		if (!account) {
			return ctx.throw(404, 'Account is NOT found.');
		}

		ctx.state.account = account;

		return next();
	}).get('/:accountId', Authorize('account.get'), ctx => {
		ctx.body = ctx.state.account;
	}).put('/:accountId', Authorize('account.update'), async ctx => {
		const { email, name, avatar } = ctx.request.body;
		const items = {};

		if (email) {
			if (typeof email !== 'string') {
				return ctx.throw(400, 'Invalid `request.body.email`, string expacted.');
			}

			items.email = email;
		}

		if (name) {
			if (typeof name !== 'string') {
				return ctx.throw(400, 'Invalid `request.body.name`, string expacted.');
			}

			items.name = name;
		}

		if (avatar) {
			if (typeof avatar !== 'string') {
				return ctx.throw(400, 'Invalid `request.body.avatar`, string expacted.');
			}

			items.avatar = avatar;
		}

		ctx.body = await ctx.state.account.$update();
	});
};