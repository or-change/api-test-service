'use strict';

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
		Server: _Server,
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

	finalOptions.name = _name;
	finalOptions.version = _version;
	finalOptions.namespace = _namespace;
	finalOptions.Server = _Server;
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

function NOOP() {}

module.exports = function Product(originalOptions, hooks) {
	const options = normalize(originalOptions);
	const {
		beforeServer = NOOP,
		afterServer = NOOP
	} = hooks;

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

	beforeServer(injection);

	const server = options.Server(injection);

	afterServer(injection);

	if (!server.RequestListener || typeof server.RequestListener !== 'function') {
		throw new TypeError('Invalid server instance without `server.RequestListener()`.');
	}

	return {
		requestListrner: server.RequestListener(),
		Webpack
	};
};