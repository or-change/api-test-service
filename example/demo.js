const Examiner = require('..');
const BasicSuitePlugin = require('../plugins/basic');
const Persistence = require('./persistence');
const fs = require('fs');
const path = require('path');

const db = Persistence.DB();
const PASSWORD_REG = /\w{4,20}/;

const tempPath = path.join(__dirname, '.temp');

try {
	fs.statSync(tempPath);
} catch (error) {
	fs.mkdirSync(tempPath);
}

module.exports = Examiner({
	temp: {
		path: tempPath
	},
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
		}
	},
	plugins: [
		BasicSuitePlugin()
	],
	model: {
		id: 'orchange',
		store: db.store
	}
});