module.exports = {
	Account(options) {
		return {
			schemas: {
				type: 'object',
				properties: {
					abstract: { type: 'model', symbol: 'AccountAbstract' }
				}
			},
			methods: {
				create(payload) {
					return options.account.create(payload);
				},
				delete(payload) {
					return options.account.delete(payload);
				},
				update(payload) {
					return options.account.update(payload);
				},
				query(payload) {
					return options.account.query(payload);
				}
			}
		};
	},
	AccountList(options) {
		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'Account' }
			},
			methods: {
				query(payload) {
					return options.account.list.query(payload);
				},
				delete(payload) {
					return options.account.list.delete(payload);
				}
			}
		};
	},
	AccountAbstract() {
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
			}
		};
	},
};