import Vue from 'vue';
import FibricUi from '@or-change/fabric-ui';
import FibricUiWeb from '@or-change/fabric-ui-web';

import * as product from './product';

Vue.use(FibricUi);
Vue.use(FibricUiWeb);

import Router from './router';

const productContext = {
	routerOptions: [],
	component: {
		source: {},
		executor: {},
		scanner: {},
		reporter: {}
	},
	beforeAppMountHandler: []
};

product.installerList.forEach(installer => {
	return installer({
		router: {
			add(options) {
				productContext.routerOptions.push(options);
			}
		},
		source: {
		},
		executor: {

		},
		scanner: {

		},
		reporter: {

		},
		beforeAppMount(handler) {
			productContext.beforeAppMountHandler.push(handler);
		}
	});
});

Vue.prototype.$product = productContext.component;

const app = new Vue({
	router: Router(productContext.routerOptions)
});

productContext.beforeAppMountHandler.forEach(handler => handler(app));