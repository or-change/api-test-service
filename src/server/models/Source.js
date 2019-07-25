const TPYE = { DESCRIBE: 0, IT: 1 };

module.exports = {
	Source() {
		return {
			schemas: {
				type: 'object',
				properties: {
					abstract: { type: 'model', symbol: 'SourceAbstract' },
					sturcture: { type: 'model', symbol: 'CaseTree' },
					// achievement: { type: 'blob' },
					executions: { type: 'model', symbol: 'ExecutionAbstractList' },
				}
			},
			
		};
	},
	SourceAbstractList() {
		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'SourceAbstract' }
			},
			methods: {
				query() {

				}
			}
		};
	},
	SourceAbstract(options) {
		return {
			schemas: {
				type: 'object',
				properties: {
					hash: { type: 'string', pattern: options.pattern.hash },
					semver: { type: 'string' },
					createdAt: { type: 'date' }
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
					versionId: { type: 'string', pattern: options.pattern.versionId },
					root: { type: 'model', symbol: 'CaseTreeNode' }
				}
			},
			methods: {
				async create() {

				},
				async query() {

				}
			}
		};
	},
};