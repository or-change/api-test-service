module.exports = {
	Project(options) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					name: { type: 'string' },
					ownerId: { type: 'string' },
					createdAt: { type: 'date' },
					// collaborators: { type: 'model', symbol: 'ProjectCollaboratorList' }
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
	},
	ProjectCollaborator() {
		return {
			schemas: {
				type: 'object',
				properties: {
					account: { type: 'model', symbol: 'Account' },
					joinedAt: { type: 'date' },
				},
			},
			methods: {
				create() {

				},
				delete() {

				}
			}
		};
	},
	ProjectCollaboratorList() {
		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'ProjectCollaborator' }
			},
			methods: {
				query() {

				},
				create() {

				},
				delete() {

				}
			}
		};
	}
};