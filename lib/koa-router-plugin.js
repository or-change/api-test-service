const KoaRouter = require('koa-router');

function normalize(options) {
	function normalizeOptionsNode(optionsNode) {
		const finalOptionsNode = {
			prefix: null,
			children: []
		};

		const {
			prefix: _prefix = finalOptionsNode.prefix,
			children: _children = finalOptionsNode.children,
			Router: _Router
		} = optionsNode;

		if (typeof _prefix !== 'string') {
			throw new Error('Invalid `options.prefix`, string expected.');
		}

		if (_Router === undefined) {
			throw new Error('Required `options.Router`, function expected.');
		}

		if (typeof _Router !== 'function') {
			throw new Error('Invalid `options.Router`, function expected.');
		}

		if (!Array.isArray(_children)) {
			throw new Error('Invalid `options.children`, array expected.');
		}

		if (_children.length > 0) {
			finalOptionsNode.children = _children.map(optionsNode => {
				return normalizeOptionsNode(optionsNode);
			});
		}

		finalOptionsNode.prefix = _prefix;
		finalOptionsNode.Router = _Router;

		return finalOptionsNode;
	}

	return normalizeOptionsNode(options);
}

module.exports = function KoaRouterPluginProvider(originalOptions) {
	const options = normalize(originalOptions);

	return function KoaRouterPlugin(injection) {
		function assembleRouter(optionsNode) {
			const options = {};
	
			if (optionsNode.prefix) {
				options.prefix = optionsNode.prefix;
			}
	
			const router = new KoaRouter(optionsNode);
	
			optionsNode.Router(router, injection);

			const { children } = optionsNode;

			if (children.length > 0) {
				children.forEach(optionsNode => {
					const childRouter = assembleRouter(optionsNode);

					return router.use(childRouter.routes());
				});
			}

			return router;
		}

		const router = assembleRouter(options);

		injection.Router = function middleware() {
			return router.routes();
		};
	};
};