module.exports = {
	Account(options) {
		return {
			schemas: {
				type: 'object',
				properties: {
					administrator: { type: 'boolean' },
					id: { type: 'string' },
					name: { type: 'string' },
					email: { type: 'string' },
					avatar: { type: 'string' }
				},
				allowNull: ['email']
			},
			methods: {
				create(payload) {
					return options.account.create(payload);
				},
				delete(payload) {
					return options.account.delete(payload);
				},
				update(items) {
					return options.store.updateAccount(this.id, items);
				},
				query(accountId) {
					return options.store.getAccountById(accountId);
				}
			}
		};
	},
	AccountList(options) {
		const selector = {
			name: options.store.queryAccountByName,
			all: options.store.queryAccountAll
		};

		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'Account' }
			},
			methods: {
				async query({ selector: type, args }) {
					return await selector[type](args);
				}
			}
		};
	}
};