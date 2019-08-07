const STATUS = { IDEL: -1, FETCHING: 0, INSTALLING: 1, RUNNING: 2, END: 3 };

module.exports = {
	Execution(options) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					sourceId: { type: 'string' },
					progress: {
						type: 'object',
						properties: {
							length: { type: 'number' },
							ended: { type: 'number' }
						}
					},
					status: {
						type: 'number',
						range: [
							STATUS.IDEL,
							STATUS.FETCHING,
							STATUS.INSTALLING,
							STATUS.RUNNING,
							STATUS.END
						]
					},
					error: { type: 'string' },
					executor: { type: 'string' },
					createdAt: { type: 'date' },
					endedAt: { type: 'date' },
					log: { type: 'string' },
					result: { type: 'string' }
				},
				allowNull: ['log', 'endedAt', 'progress', 'result', 'error']
			},
			methods: {
				async create({ sourceId, executor }) {
					return options.store.createExecution({ sourceId, executor });
				},
				async delete() {
					return options.store.destroyExecution(this.id, this.sourceId);
				},
				async query({ sourceId, executionId }) {
					return options.store.getExecutionById(executionId, sourceId);
				},
				async update() {

				}
			}
		};
	},
	ExecutionList(options) {
		const selector = {
			sourceId: options.store.queryExecutionBySourceId
		};

		return {
			schemas: {
				type: 'array',
				items: { 
					type: 'object',
					properties: {
						id: { type: 'string' },
						sourceId: { type: 'string' },
						progress: {
							type: 'object',
							properties: {
								length: { type: 'number' },
								ended: { type: 'number' }
							}
						},
						status: {
							type: 'number',
							range: [
								STATUS.IDEL,
								STATUS.FETCHING,
								STATUS.INSTALLING,
								STATUS.RUNNING,
								STATUS.END
							]
						},
						error: { type: 'string' },
						executor: { type: 'string' },
						createdAt: { type: 'date' },
						endedAt: { type: 'date' },
						result: { type: 'string' }
					},
					allowNull: ['endedAt', 'progress', 'result', 'error']
				}
			},
			methods: {
				async query({ selector: type, args }) {
					return await selector[type](args);
				}
			}
		};
	}
};