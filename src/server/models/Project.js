module.exports = {
	Project(options) {
		return {
			schemas: {
				type: 'object',
				properties: {
					schemas: {
						type: 'object',
						properties: {
							id: { type: 'string', pattern: options.pattern.hash },
							name: { type: 'string', pattern: options.pattern.projectName },
							owner: { type: 'model', symbol: 'AccountAbstract' },
							collaborators: {
								type: 'array',
								items: { type: 'model', symbol: 'AccountAbstract' }
							}
						}
					}
				}
			},
			methods: {
				async create() {

				},
				async update() {

				},
				async query() {

				},
				async delete() {

				}
			}
		};
	},
	ProjectList() {
		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'Project' }
			},
			methods: {
				async query() {

				}
			}
		};
	}
};