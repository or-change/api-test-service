import Vue from 'vue';
import FibricUi from '@or-change/fabric-ui';
import FibricUiWeb from '@or-change/fabric-ui-web';
import http from './plugins/http';

import '@or-change/fabric-ui-font';
import './mask.css';

Vue.use(FibricUi, { size: 'sm' });
Vue.use(FibricUiWeb);
Vue.use(http);

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

import App from './components/App';
import Router from './router';
import store from './store';

const router = Router(productContext.routerOptions);
const mask = document.createElement('div');

mask.id = 'app-product-mask';

router.beforeEach((to, from, next) => {
	if (to.matched.length === 0) {
		return next('/workbench/portal');
	}

	mask.className = 'blocked';

	const timer = setTimeout(() => {
		mask.className = 'blocked long-blocked';
	}, 3000);

	store.dispatch('authenticate').finally(() => {
		mask.className = '';
		clearTimeout(timer);

		const signedIn = store.state.signedIn;
	
		if (signedIn) {
			if (to.matched.find(match => match.meta.unauthencated === true)) {
				return next('/');
			}
		} else {
			if (to.matched.find(match => match.meta.authencated === true)) {
				return next('/signin');
			}
		}
		
		next();
	});
});

const app = new Vue({ store, router, render: h => h(App) });

productContext.beforeAppMountHandler.forEach(handler => handler(app));
window.addEventListener('load', async function () {
	document.body.append(mask);

	const { $http } = Vue;
	const product = await $http.product.get();

	document.title = product.name;

	app.$mount('#app');
});