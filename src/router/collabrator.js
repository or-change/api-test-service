module.exports = function CollabratorRouter(router, { Authorize, Model, Registry }) {
	router.post('/account/:accountId', Authorize(''), async ctx => {

	}).get('/account', Authorize(''), async ctx => {

	}).delete('/account/:accountId', Authorize(''), async ctx => {

	});
};