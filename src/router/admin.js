module.exports = function AdminRouter(router, { Authorize, Model }) {
	router.use(Authorize('admin.system')).get('/overview', ctx => {
		
	}).get('/project', ctx => {

	}).put('/project/owner', ctx => {

	}).post('/account', async ctx => {
		const account = await Model.Account.create({
			
		});
	}).put('/account/:accountId', ctx => {

	}).delete('/account/:accountId', ctx => {

	});
};