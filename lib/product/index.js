const Webpack = require('./webpack');

function normalize(options) {
	const finalOptions = {
		name: 'Product Default Name',
		version: '0.0.0',
		namespace: 'default',
		injection: {}
	};

	const {
		name: _name = finalOptions.name,
		version: _version = finalOptions.version,
		namespace: _namespace = finalOptions.namespace,
		injection: _injection = finalOptions.injection,
		server: _server
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

	if (!_server) {
		throw new ReferenceError('`options.server` is NOT defined.');
	}

	if (typeof _server !== 'function') {
		throw new TypeError('Invalid `options.server`, function expected.');
	}

	if (typeof _injection !== 'object') {
		throw new TypeError('Invalid `options.injection`, object expected.');
	}

	finalOptions.name = _name;
	finalOptions.version = _version;
	finalOptions.namespace = _namespace;
	finalOptions.server = _server;
	finalOptions.injection = _injection;

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

module.exports = function Product(originalOptions) {
	const options = normalize(originalOptions);
	const injection = new Proxy(
		Object.assign({
			product: {
				abstract: {
					name: options.name,
					version: options.version,
					namespace: options.namespace
				}
			}
		}, options.injection),
		injectionProxyHandler
	);

	const server = options.Server(injection);

	if (!server.RequestListener || typeof server.RequestListener !== 'function') {
		throw new TypeError('Invalid server instance without `server.RequestListener()`.');
	}

	return {
		requestListrner: server.RequestListener(),
		webpack: Webpack()
	};
};