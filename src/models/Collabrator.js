module.exports = {
	Collabrator(options) {
		
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					projectId: { type: 'string' },
					accountId: { type: 'string' },
					inviter: { type: 'string' },
					joinedAt: { type: 'date' },
					exitedAt: { type: 'date' }
				},
				allowNull: [
					'exitedAt'
				]
			},
			methods: {
				create({ projectId, accountId, inviter }) {
					return options.store.createCollabrator({ projectId, accountId, inviter });
				},
				query(id) {
					return options.store.getCollabrator(id);
				},
				update() {
					return options.store.updateCollabrator(this.id);
				}
			}
		};
	},
	CollabratorList(options) {
		const {
			queryCollabratorByProjectId
		} = options.store;

		const selector = {
			projectId: queryCollabratorByProjectId
		};

		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'Collabrator' }
			},
			methods: {
				async query({ selector: type, args }) {
					return await selector[type](args);
				}
			}
		};
	}
};