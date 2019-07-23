module.exports = {
	Execution(options) {
		return {
			schemas: {
				type: 'object',
				properties: {
					abstract: { type: 'model', symbol: 'ExecutionAbstract' },
					version: { type: 'model', symbol: 'VersionAbstract' },
					project: { type: 'model', symbol: 'ProjectAbstract' },
					report: { type: 'model', symbol: 'Report' }
				},
				allowNull: ['report']
			},
			methods: {
				async create() {

				},
				async delete(payload) {

				}
			}
		}
	},
	ExecutionAbstract(options) {
		return {
			schemas: {
				type: 'object',
				properties: {
					state: {
						type: 'object',
						properties: {
							length: { type: 'number' },
							ended: { type: 'number' }
						}
					},
					hash: { type: 'string', pattern: options.pattern.hash },
					startAt: { type: 'date' },
					endAt: { type: 'date' },
					mode: { type: 'object' } //TODO
				}
			}
		}
	},
	ExecutionAbstractList() {
		return {
			symbol: 'ExecutionAbstractList',
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'ExecutionAbstract' }
			},
			methods: {
				async query(payload) {

				},
				async delete(payload) {
					const { hashList } = payload;

				}
			}
		}
	}
}