const DefaultOptions = require('./ExaminerDefaultOptions');
const validate = require('./ExaminerOptionsValidator');

module.exports = function normalizeOptions(options) {
	validate(options);

	const finalOptions = DefaultOptions();
	const {
		product: _product = finalOptions.product,
		temp: _temp = finalOptions.temp,
		scanner: _scanner = finalOptions.scanner,
		server: _server = finalOptions.server,
		model: _model = finalOptions.model,
		plugins: _plugins = finalOptions.plugins
	} = options;

	if (_product) {
		const {
			name: _name = finalOptions.product.name,
			version: _version = finalOptions.product.version,
			namespace: _namespace = finalOptions.product.namespace
		} = _product;

		finalOptions.product.name = _name;
		finalOptions.product.version = _version;
		finalOptions.product.namespace = _namespace;
	}

	if (_temp) {
		const {
			path: _path = finalOptions.temp.path
		} = _temp;

		finalOptions.temp.path = _path;
	}

	if (_scanner) {
		const {
			path: _path = finalOptions.scanner.path
		} = _scanner;

		finalOptions.scanner.path = _path;
	}

	if (_server) {
		const {
			authenticate: _authenticate = finalOptions.server.authorize,
			session: _session = finalOptions.server.session,
			public: _public = finalOptions.server.public,
		} = _server;

		finalOptions.server.authenticate = _authenticate;
		finalOptions.server.session = _session;

		if (_public) {
			const {
				path: _path = finalOptions.server.serve.path,
				maxage: _maxage = finalOptions.server.serve.maxage,
				gzip: _gzip = finalOptions.server.serve.gzip
			} = _public;

			finalOptions.server.public.path = _path;
			finalOptions.server.public.maxage = _maxage;
			finalOptions.server.public.gzip = _gzip;
		}
	}

	if (_model) {
		const {
			id: _id = finalOptions.model.id,
			store: _store
		} = _model;

		finalOptions.model.id = _id;
		finalOptions.model.store = _store;
	}
	
	finalOptions.plugins = _plugins;

	return finalOptions;
};