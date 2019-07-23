import Vue from 'vue';
import '@or-change/fabric-ui-font';
import FibricUi from '@or-change/fabric-ui';
import FibricUiWeb from '@or-change/fabric-ui-web';
import http from './plugins/http';

Vue.use(FibricUi);
Vue.use(FibricUiWeb);
Vue.use(http);

import Router from './router';
import store from './store';

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

import * as product from './product';

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
	store,
	router: Router(productContext.routerOptions)
});

productContext.beforeAppMountHandler.forEach(handler => handler(app));