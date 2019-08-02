const session = require('koa-session');

function normalize(options) {
	const finalOptions = {
		install(app) {
			app.keys = [Math.random().toString(16).substr(2, 8)];
			app.use(session(app));
		},
		destroy(ctx) {
			ctx.session = null;
		},
		get(ctx, key) {
			return ctx.session[key];
		},
		set(ctx, key, value) {
			return ctx.session[key] = value;
		}
	};

	const {
		install: _install = finalOptions.install,
		destroy: _destroy = finalOptions.destroy,
		set: _set = finalOptions.set,
		get: _get = finalOptions.get
	} = options;

	if (typeof _install !== 'function') {
		throw new Error('Invalid `options.authorize`, function expected.');
	}

	if (typeof _destroy !== 'function') {
		throw new Error('Invalid `options.destroy`, function expected.');
	}

	if (typeof _get !== 'function') {
		throw new Error('Invalid `options.get`, function expected.');
	}

	if (typeof _set !== 'function') {
		throw new Error('Invalid `options.set`, function expected.');
	}

	return finalOptions;
}

module.exports = function SessionPluginProvider(originalOptions) {
	const options = normalize(originalOptions);

	return function SessionPlugin(_app, injection) {
		injection.Session = options;
	};
};