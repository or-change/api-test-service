const STATUS = { IDEL: -1, FETCHING: 0, INSTALLING: 1, RUNNING: 2, END: 3 };

module.exports = {
	ProjectSourceExecution(options) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					state: {
						type: 'object',
						properties: {
							length: { type: 'number' },
							ended: { type: 'number' }
						}
					},
					status: {
						type: 'number',
						range: [
							STATUS.FETCHING, STATUS.INSTALLING,
							STATUS.RUNNING, STATUS.END
						]
					},
					executor: { type: 'string' },
					createdAt: { type: 'date' },
					endedAt: { type: 'date' },
					report: { type: 'model', symbol: 'ProjectSourceExecutionReport' }
				},
				allowNull: ['report', 'endedAt', 'state']
			},
			methods: {
				async create() {

				},
				async delete(payload) {

				},
				async query() {

				},
				async update() {

				}
			}
		};
	},
	ProjectSourceExecutionList() {
		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'ProjectSourceExecution' }
			},
			methods: {
				async query(payload) {

				}
			}
		};
	},
	ProjectSourceExecutionReport(options) {
		return {
			schemas: {
				type: 'object',
				properties: {
					hash: { type: 'string' },
					createdAt: { type: 'date' },
					body: { type: 'string' }
				}
			},
			methods: {
				async create(payload) {
					// const {} = payload;

				}
			}
		};
	}
};