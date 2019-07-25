const Router = require('koa-router');

module.exports = function AdminRouter(Authorize) {
	return new Router({ prefix: '/admin' })
		.use(Authorize('admin.system'))
		.get('/overview', ctx => {
			
		})
		.get('/project', ctx => {

		})
		.put('/project/owner', ctx => {

		})
		.post('/account', ctx => {

		})
		.put('/account/:accountId', ctx => {

		})
		.delete('/account/:accountId', ctx => {

		});
};