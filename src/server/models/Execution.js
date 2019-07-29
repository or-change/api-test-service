const STATE = {
	FETCHING: 0,
	
};

module.exports = {
	Execution(options) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					state: {
						type: 'object',
						properties: {
							length: { type: 'number' },
							finished: { type: 'number' }
						}
					},
					executor: { type: 'string' },
					startedAt: { type: 'date' },
					endedAt: { type: 'date' },
					abstract: { type: 'model', symbol: 'ExecutionAbstract' },
					version: { type: 'model', symbol: 'SourceAbstract' },
					project: { type: 'model', symbol: 'Project' },
					log: { type: 'string' }
				},
				allowNull: ['report']
			},
			methods: {
				async create() {

				},
				async delete(payload) {

				}
			}
		};
	},
	ExecutionAbstract(options) {
		return {
			schemas: {
				type: 'object',
				properties: {
				}
			}
		};
	},
	ExecutionList() {
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
		};
	}
};