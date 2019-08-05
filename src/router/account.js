module.exports = function ExecutionRouter(router, { Authorize, Model, Session }) {
	async function getAccount(ctx, next) {
		const { accountId } = ctx.params;
		const account = await Model.Account.query(accountId);

		if (!account) {
			return ctx.throw(404, 'Account is NOT found.');
		}

		ctx.state.account = account;

		return next();
	}

	router.get('/', Authorize('account.query'), async ctx => {
		const accountList = await Model.AccountList.query({
			selector: 'name',
			args: {
				name: ctx.query.name
			}
		});

		ctx.body = accountList.$data;
	}).get('/:accountId', Authorize('account.get'), getAccount, ctx => {
		ctx.body = ctx.state.account.$data;
	}).put('/:accountId', Authorize('account.update'), getAccount, async ctx => {
		if (ctx.params.accountId !== ctx.principal.account.id) {
			return ctx.throw(403);
		}

		const { account } = ctx.state;
		const finalOptions = ctx.state.account.$data;
		const {
			email: _email = finalOptions.email,
			name: _name = finalOptions.name,
			avatar: _avatar = finalOptions.avatar
		} = ctx.request.body;

		if (_email) {
			if (typeof _email !== 'string') {
				return ctx.throw(400, 'Invalid `request.body.email`, string expacted.');
			}

			finalOptions.email = _email;
		}

		if (_name) {
			if (typeof _name !== 'string') {
				return ctx.throw(400, 'Invalid `request.body.name`, string expacted.');
			}

			finalOptions.name = _name;
		}

		if (_avatar) {
			if (typeof _avatar !== 'string') {
				return ctx.throw(400, 'Invalid `request.body.avatar`, string expacted.');
			}

			finalOptions.avatar = _avatar;
		}

		await account.$update(finalOptions);
		ctx.principal.account = ctx.body = account.$data;
		Session.set(ctx, 'principal', ctx.principal);
	});
};