const credential = require('./credential.json');
const account = require('./account.json');

const db = {
	credential, account
};

module.exports = {
	account: {
		create() {

		},
		delete() {

		},
		update() {

		},
		query(id) {
			const account = db.account.find(account => account.id === id);

			return {
				abstract: {
					id: account.id,
					name: account.name,
					email: account.email,
					administrator: account.administrator,
					avatar: account.avatar
				}
			};
		},
		list: {
			query() {

			},
			delete() {

			}
		}
	}
}