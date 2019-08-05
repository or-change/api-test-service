const Webpack = require('./webpack');

function normalize(options) {
	const finalOptions = {
		name: 'Product Default Name',
		version: '0.0.0',
		namespace: 'default',
		injection: {},
		webpack: {
			entries: [],
			publicPath: ''
		}
	};

	const {
		name: _name = finalOptions.name,
		version: _version = finalOptions.version,
		namespace: _namespace = finalOptions.namespace,
		injection: _injection = finalOptions.injection,
		Server: _Server,
		webpack: _webpack = finalOptions.webpack
	} = options;

	if (typeof _name !== 'string') {
		throw new TypeError('Invalid `options.name`, string expected.');
	}

	if (typeof _version !== 'string') {
		throw new TypeError('Invalid `options.version`, string expected.');
	}

	if (typeof _namespace !== 'string') {
		throw new TypeError('Invalid `options.namespace`, string expected.');
	}

	if (!_Server) {
		throw new ReferenceError('`options.server` is NOT defined.');
	}

	if (typeof _Server !== 'function') {
		throw new TypeError('Invalid `options.server`, function expected.');
	}

	if (typeof _injection !== 'object') {
		throw new TypeError('Invalid `options.injection`, object expected.');
	}

	if (typeof _webpack !== 'object') {
		throw new TypeError('Invalid `options.webpack`, object expected.');
	}

	finalOptions.name = _name;
	finalOptions.version = _version;
	finalOptions.namespace = _namespace;
	finalOptions.Server = _Server;
	finalOptions.injection = _injection;
	finalOptions.webpack = _webpack;

	if (_webpack) {
		const {
			entries: _entries = finalOptions.webpack.entries,
			publicPath: _publicPath = finalOptions.webpack.publicPath
		} = _webpack;

		if (!Array.isArray(_entries)) {
			throw new TypeError('Invalid `options.webpack.entries`, array expected.');
		}

		if (typeof _publicPath !== 'string') {
			throw new TypeError('Invalid `options.webpack.publicPath`, string expected.');
		}

		finalOptions.webpack.entries = _entries.map((pathname, index) => {
			if (typeof pathname !== 'string') {
				throw new TypeError(`Invalid 'options.webpack.entries[${index}]', string expected.`);
			}

			return pathname;
		});

		finalOptions.webpack.publicPath = _publicPath;
	}

	return finalOptions;
}

const injectionProxyHandler = {
	set(target, key, value) {
		if (target[key]) {
			throw new ReferenceError(`Injection key='${key}' is existed.`);
		}

		return target[key] = value;
	},
	get(target, key) {
		const any = target[key];

		if (any === undefined) {
			throw new ReferenceError(`Injection key='${key}' is NOT defined.`);
		}

		return any;
	}
};

module.exports = function Product(originalOptions, factory = () => {}) {
	const options = normalize(originalOptions);
	const injection = new Proxy(
		Object.assign({
			product: {
				name: options.name,
				version: options.version,
				namespace: options.namespace
			}
		}, options.injection),
		injectionProxyHandler
	);

	const server = options.Server(injection);
	factory(injection);

	if (!server.RequestListener || typeof server.RequestListener !== 'function') {
		throw new TypeError('Invalid server instance without `server.RequestListener()`.');
	}

	return {
		requestListrner: server.RequestListener(),
		webpack: Webpack(options.webpack)
	};
};