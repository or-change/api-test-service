module.exports = Object.assign({
	Version: function Version() {
		return {
			symbol: 'Version',
			schemas: {
				type: 'object',
				properties: {
					abstract: { type: 'model', symbol: 'VersionAbstract' },
					sturcture: { type: 'model', symbol: 'CaseTree' },
					achievement: { type: 'blob' },
					executions: { type: 'model', symbol: 'ExecutionAbstractList' },
				}
			}
		}
	},
	VersionAbstract: function VersionAbstract(options) {
		return {
			symbol: 'VersionAbstract',
			schemas: {
				hash: { type: 'string', pattern: options.pattern.hash },
				semver: { type: 'string' },
				createdAt: { type: 'date' }
			}
		}
	},
	VersionAbstractList: function VersionAbstractList() {
		return {
			symbol: 'VersionAbstractList',
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'VersionAbstract' }
			}
		}
	}
}, require('./Execution'), require('./CaseTree'), require('./Report'));