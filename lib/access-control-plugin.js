function normalize(options) {
	const finalOptions = {
		authorize() {
			return true;
		}
	};

	const {
		authorize: _authorize = finalOptions.authorize
	} = options;

	if (typeof _authorize !== 'function') {
		throw new Error('Invalid `options.authorize`, function expected.');
	}

	finalOptions.authorize = _authorize;

	return finalOptions;
}

module.exports = function AccessControlPluginProvider(originalOptions) {
	const options = normalize(originalOptions);

	return function AccessControlPlugin(injection) {
		injection.Authorize = function AuthorizeMiddlerware(symbol) {
			return async function middleware(ctx, next) {
				if (await options.authorize(symbol, ctx)) {
					return next();
				}
			};
		};
	};
};