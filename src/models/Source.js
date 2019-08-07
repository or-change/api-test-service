module.exports = {
	Source(options) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					projectId: { type: 'string' },
					agent: { type: 'string' },
					initialized: { type: 'boolean' },
					semver: { type: 'string' },
					createdAt: { type: 'date' },
					structure: { type: 'object' },
				},
				allowNull: ['structure']
			},
			methods: {
				async create({ projectId, agent, semver }) {
					return options.store.createSource({ projectId, agent, semver });
				},
				async query({ sourceId, projectId }) {
					return options.store.getSourceById(sourceId, projectId);
				},
				async delete() {
					return options.store.destroySource(this.id, this.projectId);
				},
				async update({ structure }) {
					return options.store.setSourceStructure(this.id, structure);
				}
			}
		};
	},
	SourceList(options) {
		const selector = {
			projectId: options.store.querySourceByProjectId
		};

		return {
			schemas: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						id: { type: 'string' },
						projectId: { type: 'string' },
						agent: { type: 'string' },
						semver: { type: 'string' },
						createdAt: { type: 'date' },
					}
				},
			},
			methods: {
				async query({ selector: type, args }) {
					return await selector[type](args);
				}
			}
		};
	}
};