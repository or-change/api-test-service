import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.min.css';
import './style.css';

import Vue from 'vue';

import BootstrapVue from 'bootstrap-vue';
import http from './plugins/http';
import dateFormat from './plugins/dateFormat';
import Product from './plugins/product';
import Table from './components/utils/Table.vue';

import App from './components/App.vue';
import store from './store';
import Router from './router';

Vue.use(BootstrapVue);
Vue.use(dateFormat);
Vue.use(Product);
Vue.component('custom-table', Table);

const router = Router(Vue.prototype.$product.routerOptions);

Vue.use(http, { router });

router.beforeEach((to, from, next) => {
	if (to.matched.length === 0) {
		return next('/');
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

Vue.prototype.$product.beforeAppMountHandler.forEach(handler => handler(app));

window.addEventListener('load', async function () {
	const { $http } = Vue;
	const product = await $http.product.get();

	document.title = product.name;

	app.$mount('#app');
});