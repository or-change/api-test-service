const session = require('koa-session');
const path = require('path');

const STORE_METHODS = [
	'getAccountById', 'createAccount', 'destroyAccount', 'updateAccount', 'queryAccountAll',
	'queryAccountByName', 'getProjectById', 'createProject', 'updateProject',
	'destroyProject', 'queryProjectByOwnerId', 'getSourceById', 'createSource',
	'destroySource', 'querySourceByProjectId', 'createExecution', 'getExecutionById',
	'updateExecution', 'destroyExecution', 'queryExecutionBySourceId', 'updateSource'
];

module.exports = function normalizeOptions(options = {}) {
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

	if (typeof options !== 'object') {
		throw new Error('Invalid `options`, object expected.');
	}

	const finalOptions = {
		product: {
			name: 'API Testing Service Default Name',
			version: '0.0.0',
			namespace: 'octs'
		},
		temp: {
			path: path.resolve('.temp')
		},
		scanner: {
			path: path.resolve('.temp')
		},
		server: {
			authenticate(ctx, Model) {
				return UNTRUSTED_PRINCIPAL;
			},
			authorize({ symbol, ctx, Model }) {
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
		},
		model: {
			id: 'orchange',
			store: {}
		},
		plugins: [],
	};

	const {
		product: _product = finalOptions.product,
		temp: _temp = finalOptions.temp,
		scanner: _scanner = finalOptions.scanner,
		server: _server = finalOptions.server,
		model: _model = finalOptions.model,
		plugins: _plugins = finalOptions.plugins
	} = options;

	if (typeof _product !== 'object') {
		throw new TypeError('Invalid `options.product`, object expected.');
	}

	if (typeof _temp !== 'object') {
		throw new TypeError('Invalid `options.temp`, object expected.');
	}

	if (typeof _scanner !== 'object') {
		throw new TypeError('Invalid `options.scanner`, object expected.');
	}

	if (typeof _server !== 'object') {
		throw new TypeError('Invalid `options.server`, object expected.');
	}

	if (typeof _model !== 'object') {
		throw new TypeError('Invalid `options.model`, object expected.');
	}

	if (!Array.isArray(_plugins)) {
		throw new TypeError('Invalid `options.plugins`, array expected.');
	}

	if (_product) {
		const {
			name: _name = finalOptions.product.name,
			version: _version = finalOptions.product.version
		} = _product;

		if (typeof _name !== 'string') {
			throw new TypeError('Invalid options.product.name, string expected.');
		}

		if (typeof _version !== 'string') {
			throw new TypeError('Invalid options.product.version, string expected.');
		}

		finalOptions.product.name = _name;
		finalOptions.product.version = _version;
	}

	if (_temp) {
		const {
			path: _path = finalOptions.temp.path
		} = _temp;

		if (typeof _path !== 'string' || !path.isAbsolute(_path)) {
			throw new TypeError('Invalid options.temp.path, absolute path string expected.');
		}
	}

	if (_scanner) {
		const {
			path: _path = finalOptions.scanner.path
		} = _scanner;

		if (typeof _path !== 'string' || !path.isAbsolute(_path)) {
			throw new TypeError('Invalid options.temp.path, absolute path string expected.');
		}
	}

	if (_server) {
		const {
			authorize: _authorize = finalOptions.server.authorize,
			authenticate: _authenticate = finalOptions.server.authorize,
			session: _session = finalOptions.server.session,
			serve: _serve = finalOptions.server.serve,
		} = _server;

		if (typeof _authorize !== 'function') {
			throw new TypeError('Invalid options.server.authorize, function expected.');
		}

		if (typeof _authenticate !== 'function') {
			throw new TypeError('Invalid options.server.authenticate, function expected.');
		}

		if (typeof _session !== 'object') {
			throw new TypeError('Invalid options.server.session, object expected.');
		}

		if (typeof _serve !== 'object') {
			throw new TypeError('Invalid options.server.serve, object expected.');
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
				throw new TypeError('Invalid `options.server.session.install`, function expected.');
			}

			if (typeof _destroy !== 'function') {
				throw new TypeError('Invalid `options.server.session.destroy`, function expected.');
			}

			if (typeof _set !== 'function') {
				throw new TypeError('Invalid `options.server.session.set`, function expected.');
			}

			if (typeof _get !== 'function') {
				throw new TypeError('Invalid `options.server.session.get`, function expected.');
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
				throw new TypeError('Invalid `options.server.serve.path`, absolute path string expected.');
			}

			if (typeof _maxage !== 'number' || _maxage < 0) {
				throw new TypeError('Invalid `options.server.serve.maxage`, number >0 expected.');
			}

			if (typeof _gzip !== 'boolean') {
				throw new TypeError('Invalid `options.server.serve.gzip`, boolean expected.');
			}

			finalOptions.server.serve.path = _path;
			finalOptions.server.serve.maxage = _maxage;
			finalOptions.server.serve.gzip = _gzip;
		}

		finalOptions.server.model = _model;
	}

	if (_model) {
		const {
			id: _id = finalOptions.model.id,
			store: _store
		} = _model;

		if (typeof _id !== 'string') {
			throw new TypeError('Invalid `options.model.id`, string expected.');
		}

		if (_store === undefined) {
			throw new ReferenceError('Required `options.model.store` is NOT defined.');
		}

		if (typeof _store !== 'object') {
			throw new TypeError('Invalid `options.model.store`, object expected.');
		}

		finalOptions.model.id = _id;
		
		if (_store) {
			finalOptions.model.store = STORE_METHODS.reduce((store, methodName) => {
				const method = _store[methodName];

				if (typeof method !== 'function') {
					throw new TypeError(`Invalid 'options.model.store.${methodName}', function expected.`);
				}

				store[methodName] = method;

				return store;
			}, {});
		}
	}
	
	if (_plugins) {
		const plugins = finalOptions.plugins = [];

		_plugins.forEach((options, index) => {
			if (typeof options !== 'object') {
				throw new Error(`Invalid options.plugins[${index}], object expected.`);
			}

			plugins.push(options);
		});
	}

	return finalOptions;
};