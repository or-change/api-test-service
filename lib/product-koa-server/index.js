const Koa = require('koa');

function normalize(options) {
	const finalOptions = {
		factory(app) {
			app.use(ctx => ctx.body = 'hello, world! --ProductKoaServer');
		},
		plugins: []
	};

	const {
		factory: _factory = finalOptions.factory,
		plugins: _plugins = finalOptions.plugins
	} = options;

	if (typeof _factory !== 'function') {
		throw new Error('Invalid `options.factory`, function expected.');
	}

	if (!Array.isArray(_plugins)) {
		throw new Error('Invalid `options.plugins`, array expected.');
	}

	finalOptions.factory = _factory;

	if (_plugins) {
		finalOptions.plugins = _plugins.map((Plugin, index) => {
			if (typeof Plugin !== 'function') {
				throw new Error(`Invalid 'options.plugins[${index}]', function expected.`);
			}

			return Plugin;
		});
	}

	return finalOptions;
}

module.exports = function ProductKoaServerProvider(originalOptions) {
	const { factory, plugins } = normalize(originalOptions);

	return function Server(injection) {
		const app = new Koa();

		plugins.forEach(provider => provider(injection));
		factory(app, injection);

		return {
			RequestListener() {
				return app.callback();
			}
		};
	};
};