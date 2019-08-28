import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.min.css';
import './style/mask.css';

import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import http from './plugins/http';
import dateFormat from './plugins/dateFormat';
import Table from './components/utils/Table.vue';

import *  as product from './product';
import SignIn from './components/pages/SignIn';

import App from './components/App.vue';
import store from './store';
import Router from './router';

const context = {
	routerOptions: [],
	product: {
		source: {},
		executor: {},
		scanner: {},
		SignIn
	},
	beforeAppMountHandler: []
};
const router = Router(context.routerOptions);

Vue.use(BootstrapVue);
Vue.use(dateFormat);
Vue.use(http, { router });
Vue.component('custom-table', Table);

Vue.prototype.$product = context.product;

product.installerList.forEach(installer => {
	return installer({
		router: {
			add(options) {
				context.routerOptions.push(options);
			}
		},
		source: {
			add(key, options) {
				if (!context.product.source[key]) {
					context.product.source[key] = options;
				}
			}
		},
		executor: {
			add(key, options) {
				if (!context.product.executor[key]) {
					context.product.executor[key] = options;
				}
			}
		},
		scanner: {
			add(key, options) {
				if (!context.product.scanner[key]) {
					context.product.scanner[key] = options;
				}
			}
		},
		beforeAppMount(handler) {
			context.beforeAppMountHandler.push(handler);
		}
	});
});

router.beforeEach((to, from, next) => {
	if (to.matched.length === 0) {
		return next('/workbench/welcome');
	}

	store.dispatch('authenticate').finally(() => {
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

const app = Vue.prototype.$eventBus = new Vue({ store, router, render: h => h(App) });

context.beforeAppMountHandler.forEach(handler => handler(app));

window.addEventListener('load', async function () {
	const { $http } = Vue;
	const product = await $http.product.get();

	document.title = product.name;

	app.$mount('#app');
});