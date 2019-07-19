const TPYE = {
	DESCRIBE: 0,
	IT: 1
};

module.exports = {
	CaseTreeNode() {
		return {
			schemas: {
				type: 'object',
				properties: {
					title: { type: 'string' },
					type: {
						type: 'number',
						range: [TPYE.DESCRIBE, TPYE.IT]
					},
					childNodeList: {
						type: 'array',
						items: {
							type: 'model',
							symbol: 'CaseTreeNode'
						}
					}
				},
				allowNull: ['childNodeList']
			}
		};
	}
};