const META_TEST = [
	function withPrincipal(ctx) {
		return Boolean(ctx.principal);
	},
	function withoutPrincipal(ctx) {
		return !ctx.principal;
	},
	function administratorOnly(ctx) {
		return ctx.principal.account.administrator;
	},
	function projectOwnerOnly(ctx) {
		return ctx.principal.account.id === ctx.state.project.ownerId;
	},
	function notOAuthCredential(ctx) {
		return ctx.principal.credential !== 'oauth';
	}
];

const SYMBOL_META = {
	'product.query':          [0, 0, 0, 0, 0],
	'principal.create':       [0, 1, 0, 0, 0],
	'principal.get':          [1, 0, 0, 0, 1],
	'principal.delete':       [1, 0, 0, 0, 1],
	'account.query':          [1, 0, 0, 0, 1],
	'account.update':         [1, 0, 0, 0, 1],
	'account.get':            [1, 0, 0, 0, 0],
	'project.query':          [1, 0, 0, 1, 0],
	'project.create':         [1, 0, 0, 1, 0],
	'project.get':            [1, 0, 0, 1, 0],
	'project.update':         [1, 0, 0, 1, 0],
	'project.delete':         [1, 0, 0, 1, 1],
	'source.query':           [1, 0, 0, 1, 0],
	'source.create':          [1, 0, 0, 1, 0],
	'source.get':             [1, 0, 0, 1, 0],
	'source.delete':          [1, 0, 0, 1, 1],
	'source.pack.get':        [1, 0, 0, 1, 1],
	'execution.query':        [1, 0, 0, 1, 0],
	'execution.create':       [1, 0, 0, 1, 0],
	'execution.get':          [1, 0, 0, 1, 0],
	'execution.delete':       [1, 0, 0, 1, 1],
	'execution.report.get':   [1, 0, 0, 1, 1],
	'admin':                  [1, 0, 1, 0, 0]
};

function normalize() {

}

module.exports = function Authorizer() {
	

	return function authorize(symbol, ctx) {
		const table = SYMBOL_META[symbol];

		if (!table) {
			throw new Error('Symbol is NOT defined.');
		}

		const hasViolation = table.some((needTest, index) => {
			needTest && !META_TEST[index](ctx);
		});

		return !hasViolation;
	};
};