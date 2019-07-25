module.exports = {
	AccountAbstract() {
		return {
			schemas: {
				type: 'object',
				properties: {
					name: { type: 'string' },
					email: { type: 'string' },
					avatar: { type: 'string' }
				},
				allowNull: ['email']
			}
		};
	},
	Account(options) {
		return {
			schemas: {
				type: 'object',
				properties: {
					hash: { type: 'string' },
					administrator: { type: 'boolean' },
					abstract: { type: 'model', symbol: 'AccountAbstract' }
				}
			},
			methods: {
				async create() {

				},
				async update() {

				},
				async delete() {

				},
				async query() {

				}
			}
		};
	},
	AccountList() {
		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'Account' }
			},
			methods: {
				async query() {

				},
				async delete() {

				}
			}
		};
	},
	Principal() {
		return {
			schemas: {
				type: 'object',
				properties: {
					account: { type: 'model', symbol: 'Account' }
				}
			},
			methods: {
				async query(credential) {

				}
			}
		};
	}
};