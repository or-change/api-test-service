module.exports = Object.assign({
	CaseTree(options) {
		return {
			schemas: {
				type: 'object',
				properties: {
					abstract: {
						type: 'object',
						properties: {
							caseLength: {
								type: 'mumber',
								range: [{ gt: { value: 0, equal: true } }]
							},
							versionId: {
								type: 'string',
								pattern: options.pattern.versionId
							}
						}
					},
					root: {
						type: 'model',
						symbol: 'CaseTreeNode'
					}
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
	CaseTreeNode: require('./Node')
}, require('./Node.js'));