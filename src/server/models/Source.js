const TPYE = { DESCRIBE: 0, IT: 1 };

module.exports = {
	Source() {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					projectId: { type: 'string' },
					agent: { type: 'string' },
					semver: { type: 'string' },
					createdAt: { type: 'date' },
					sturcture: { type: 'model', symbol: 'CaseTree' },
					executions: { type: 'model', symbol: 'ExecutionAbstractList' },
				},
				allowNull: ['structure']
			},
			methods: {
				async create() {

				},
				async query() {

				},
				async update() {

				},
				async delete() {

				}
			}
		};
	},
	SourceList() {
		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'Source' }
			},
			methods: {
				async query() {

				}
			}
		};
	},
	CaseTreeNode() {
		return {
			schemas: {
				type: 'object',
				properties: {
					title: { type: 'string' },
					type: { type: 'number', range: [TPYE.DESCRIBE, TPYE.IT] },
					childNodeList: {
						type: 'array',
						items: { type: 'model', symbol: 'CaseTreeNode' }
					}
				},
				allowNull: ['childNodeList']
			}
		};
	},
	CaseTree(options) {
		return {
			schemas: {
				type: 'object',
				properties: {
					root: { type: 'model', symbol: 'CaseTreeNode' }
				}
			}
		};
	},
};