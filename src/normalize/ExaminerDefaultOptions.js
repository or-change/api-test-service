const session = require('koa-session');
const path = require('path');

module.exports = function DefaultExaminerOptions() {
	return {
		product: {
			name: 'API Testing Service Default Name',
			version: '0.0.0',
			namespace: 'oc'
		},
		temp: {
			path: path.resolve('.temp')
		},
		server: {
			session: {
				install(app) {
					app.keys = [Math.random().toString(16).substr(2, 8)];
					app.use(session(app));
				},
				destroy(ctx) {
					ctx.session = null;
				},
				set(ctx, key, value) {
					return ctx.session[key] = value;
				},
				get(ctx, key) {
					return ctx.session[key];
				}
			},
			public: {
				path: path.resolve('.public'),
				maxage: 0,
				gzip: true
			},
		},
		model: {
			id: 'orchange'
		},
		plugins: [],
	};
};