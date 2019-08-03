module.exports = {
	ProjectSource() {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					projectId: { type: 'string' },
					agent: { type: 'string' },
					semver: { type: 'string' },
					createdAt: { type: 'date' },
					structure: { type: 'string' },
				},
				allowNull: ['structure']
			},
			methods: {
				async create() {

				},
				async query() {

				},
				async delete() {

				}
			}
		};
	},
	ProjectSourceList() {
		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'ProjectSource' }
			},
			methods: {
				async query() {

				}
			}
		};
	}
};