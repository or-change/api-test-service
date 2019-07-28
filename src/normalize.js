const session = require('koa-session');
const path = require('path');

module.exports = function normalizeOptions(options) {
	const UNTRUSTED_PRINCIPAL = {
		credential: 'mock',
		authenticatedAt: new Date(),
		account: {
			id: '0000000',
			name: 'developer',
			administrator: true,
			email: 'developer@dev.com',
			avatar: ''
		}
	};

	const finalOptions = {
		product: {
			name: 'API Testing Service Default Name',
			version: '0.0.0',
			namespace: 'octs'
		},
		server: {
			authenticate(ctx) {
				return UNTRUSTED_PRINCIPAL;
			},
			authorize(symbol, ctx) {
				return true;
			},
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
			serve: {
				path: path.resolve('.public'),
				maxage: 0,
				gzip: true
			},
			model: {
				id: 'orchange',
				pattern: {
					hash: /.*/
				},
				store: {}
			}
		},
		plugins: [],
	};

	const {
		product: _product = finalOptions.product,
		server: _server = finalOptions.server,
		plugins: _plugins = finalOptions.plugins
	} = options;

	if (typeof _product !== 'object') {
		throw new Error('Invalid options.product, object expected.');
	}

	if (typeof _server !== 'object') {
		throw new Error('Invalid options.server, object expected.');
	}

	if (!Array.isArray(_plugins)) {
		throw new Error('Invalid options.plugins, array expected.');
	}

	if (_product) {
		const {
			name: _name = finalOptions.product.name,
			version: _version = finalOptions.product.version
		} = _product;

		if (typeof _name !== 'string') {
			throw new Error('Invalid options.product.name, string expected.');
		}

		if (typeof _version !== 'string') {
			throw new Error('Invalid options.product.version, string expected.');
		}

		finalOptions.product.name = _name;
		finalOptions.product.version = _version;
	}

	if (_server) {
		const {
			authorize: _authorize = finalOptions.server.authorize,
			authenticate: _authenticate = finalOptions.server.authorize,
			session: _session = finalOptions.server.session,
			serve: _serve = finalOptions.server.serve,
			model: _model = finalOptions.server.model
		} = _server;

		if (typeof _authorize !== 'function') {
			throw new Error('Invalid options.server.authorize, function expected.');
		}

		if (typeof _authenticate !== 'function') {
			throw new Error('Invalid options.server.authenticate, function expected.');
		}

		if (typeof _session !== 'object') {
			throw new Error('Invalid options.server.session, object expected.');
		}

		if (typeof _serve !== 'object') {
			throw new Error('Invalid options.server.serve, object expected.');
		}

		if (typeof _model !== 'object') {
			throw new Error('Invalid options.server.model, object expected.');
		}

		finalOptions.server.authorize = _authorize;
		finalOptions.server.authenticate = _authenticate;
		
		if (_session) {
			const {
				install: _install = finalOptions.server.session.install,
				destroy: _destroy = finalOptions.server.session.destroy,
				set: _set = finalOptions.server.session.set,
				get: _get = finalOptions.server.session.get
			} = _session;

			if (typeof _install !== 'function') {
				throw new Error('Invalid options.server.session.install, function expected.');
			}

			if (typeof _destroy !== 'function') {
				throw new Error('Invalid options.server.session.destroy, function expected.');
			}

			if (typeof _set !== 'function') {
				throw new Error('Invalid options.server.session.set, function expected.');
			}

			if (typeof _get !== 'function') {
				throw new Error('Invalid options.server.session.get, function expected.');
			}

			finalOptions.server.session.install = _install;
			finalOptions.server.session.destroy = _destroy;
			finalOptions.server.session.set = _set;
			finalOptions.server.session.get = _get;
		}

		if (_serve) {
			const {
				path: _path = finalOptions.server.serve.path,
				maxage: _maxage = finalOptions.server.serve.maxage,
				gzip: _gzip = finalOptions.server.serve.gzip
			} = _serve;

			if (typeof _path !== 'string' || !path.isAbsolute(_path)) {
				throw new Error('Invalid options.server.serve.path, absolute path string expected.');
			}

			if (typeof _maxage !== 'number' || _maxage < 0) {
				throw new Error('Invalid options.server.serve.maxage, number >0 expected.');
			}

			if (typeof _gzip !== 'boolean') {
				throw new Error('Invalid options.server.serve.gzip, boolean expected.');
			}

			finalOptions.server.serve.path = _path;
			finalOptions.server.serve.maxage = _maxage;
			finalOptions.server.serve.gzip = _gzip;
		}

		finalOptions.server.model = _model;
	}
	
	if (_plugins) {
		const plugins = finalOptions.plugins = [];

		_plugins.forEach((installer, index) => {
			if (typeof installer !== 'function') {
				throw new Error(`Invalid options.plugins[${index}], function expected.`);
			}

			plugins.push(installer);
		});
	}

	return finalOptions;
};