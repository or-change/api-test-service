const TestingService = require('..');
const BasicSuitePlugin = require('../plugin/base');
const Persistence = require('./persistence');

const db = Persistence.DB();
const PASSWORD_REG = /\w{4,20}/;

module.exports = TestingService({
	server: {
		async authenticate(ctx, Model) {
			const {
				username, password
			} = ctx.request.body;
	
			const accountList = await Model.AccountList.query({
				selector: 'name',
				args: {
					name: username,
					exect: true
				}
			});
	
			if (!accountList.length || !PASSWORD_REG.test(password)) {
				ctx.throw(401);
	
				return false;
			}
	
			ctx.state.authentication = {
				credential: 'simple',
				accountId: accountList[0].id
			};
	
			return true;
		},

	},
	plugins: [
		BasicSuitePlugin()
	],
	model: {
		id: 'orchange',
		store: db.store
	}
});

// appendProjectCollaborator() {

// },
// removeProjectCollaborator() {

// },