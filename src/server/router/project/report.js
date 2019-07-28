const Router = require('koa-router');

module.exports = function ReportRouter(Middleware) {
	const { Authorize } = Middleware;

	return new Router({ prefix: '/report' })
		.get('/', Authorize('report.query'), async ctx => {

		})
		.post('/', Authorize('report.create'), async ctx => {

		})
		.param(':reportId', (reportId, ctx, next) => {

		})
		.get('/:reportId', Authorize('report.get'), async ctx => {

		})
		.delete('/:reportId', Authorize('report.delete'), async ctx => {

		});
};