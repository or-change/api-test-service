module.exports = Object.assign({
	Version() {
		return {
			schemas: {
				type: 'object',
				properties: {
					abstract: { type: 'model', symbol: 'VersionAbstract' },
					sturcture: { type: 'model', symbol: 'CaseTree' },
					// achievement: { type: 'blob' },
					executions: { type: 'model', symbol: 'ExecutionAbstractList' },
				}
			}
		}
	},
	VersionAbstract(options) {
		return {
			schemas: {
				type: 'object',
				properties: {
					hash: { type: 'string', pattern: options.pattern.hash },
					semver: { type: 'string' },
					createdAt: { type: 'date' }
				}
			}
		}
	},
	VersionAbstractList() {
		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'VersionAbstract' }
			}
		}
	}
}, require('./Execution'), require('./CaseTree'), require('./Report'));