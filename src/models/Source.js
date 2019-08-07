module.exports = {
	Source(options) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					projectId: { type: 'string' },
					agent: { type: 'string' },
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
				async query(id) {
					return options.store.getSourceById(id);
				},
				async delete() {
					return options.store.destroySource(this.id);
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