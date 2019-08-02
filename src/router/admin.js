module.exports = function AdminRouter(router, { Authorize }) {
	router.use(Authorize('admin.system')).get('/overview', ctx => {
		
	}).get('/project', ctx => {

	}).put('/project/owner', ctx => {

	}).post('/account', ctx => {

	}).put('/account/:accountId', ctx => {

	}).delete('/account/:accountId', ctx => {

	});
};