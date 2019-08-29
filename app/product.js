export const store = {
	routerOptions: [],
	source: {},
	executor: {},
	scanner: {},
	beforeAppMountHandler: []
};

const register = {
	router(options) {
		store.routerOptions.push(options);
	},
	source(key, {
		name, global, detail
	}) {
		store.source[key] = {
			global, detail, name
		};
	},
	executor(key, {
		name, global, detail
	}) {
		store.executor[key] = {
			global, detail, name
		};
	},
	scanner(key, {
		name, global, detail
	}) {
		store.scanner[key] = {
			global, detail, name
		};
	},
	beforeAppMount(handler) {
		store.beforeAppMountHandler.push(handler);
	}
};

window.product = {
	use(installer) {
		installer(register);
	}
};