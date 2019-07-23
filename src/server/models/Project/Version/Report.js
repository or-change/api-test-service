module.exports = {
	Report: function Report() {
		return {
			symbol: 'Report',
			schemas: {
				type: 'object',
				properties: {
					abstract: { type: 'model', symbol: 'ReportAbstract' },
					// body: { type: 'blob' }
				}
			},
			methods: {
				async create(payload) {
					const {} = payload;

				},
				async update() {

				}
			}
		}
	},
	ReportAbstract(options) {
		return {
			schemas: {
				type: 'object',
				properties: {
					hash: { type: 'string', pattern: options.pattern.hash },
					createdAt: { type: 'date' },
					name: { type: 'string' }
				},
				allowNull: ['name']
			}
		}
	}
};