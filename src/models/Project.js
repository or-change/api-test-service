module.exports = {
	Project(options) {

		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					name: { type: 'string' },
					ownerId: { type: 'string' },
					createdAt: { type: 'date' }
				}
			},
			methods: {
				async create({ name, ownerId }) {
					return options.store.createProject({ name, ownerId });
				},
				async update(items) {
					return options.store.updateProject(this.id, items);
				},
				async query(projectId) {
					return options.store.getProjectById(projectId);
				},
				async delete() {
					return options.store.destroyProject(this.id);
				}
			}
		};
	},
	ProjectList(options) {
		const selector = {
			ownerId: options.store.queryProjectByOwnerId,
			all: options.store.queryProjectAll
		};

		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'Project' }
			},
			methods: {
				async query({ selector: type, args }) {
					return await selector[type](args);
				}
			}
		};
	}
};