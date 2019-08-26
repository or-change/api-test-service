module.exports = {
	Collabrator(options) {
		
		return {
			schemas: {
				type: 'object',
				properties: {
					projectId: { type: 'string' },
					accountId: { type: 'string' },
					inviter: { type: 'string' },
					createdAt: { type: 'date' }
				},
			},
			methods: {
				create() {

				},
				query() {

				},
				delete() {

				}
			}
		};
	}
};