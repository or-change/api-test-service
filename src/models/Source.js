const STATUS = { SETTING: 0, READY: 1, UNZIP: 2, INSTALLING: 3, SCANNING: 4, END: 5 };

module.exports = {
	Source(options) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					projectId: { type: 'string' },
					agent: { type: 'string' },
					status: {
						type: 'number',
						range: [
							STATUS.SETTING,
							STATUS.READY,
							STATUS.UNZIP,
							STATUS.INSTALLING,
							STATUS.SCANNING,
							STATUS.END
						]
					},
					error: { type: 'string' },
					semver: { type: 'string' },
					createdAt: { type: 'date' },
					structure: { type: 'object' },
				},
				allowNull: ['structure', 'error']
			},
			methods: {
				async create({ projectId, agent, semver }) {
					return options.store.createSource({ projectId, agent, semver });
				},
				async query({ sourceId }) {
					return options.store.getSourceById(sourceId);
				},
				async delete() {
					return options.store.destroySource(this.id);
				},
				async update({ status, error, structure }) {
					return options.store.updateSource(this.id, { status, error, structure });
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