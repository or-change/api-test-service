import '@or-change/fabric-ui-font';
import './style/mask.css';
import './style/style.scss';
import Vue from 'vue';

import SignIn from './components/pages/SignIn';

const context = {
	routerOptions: [],
	product: {
		source: {},
		executor: {},
		// reporter: {},
		SignIn
	},
	beforeAppMountHandler: []
};

import Router from './router';
const router = Router(context.routerOptions);

import FibricUi from '@or-change/fabric-ui';
import FibricUiWeb from '@or-change/fabric-ui-web';
import http from './plugins/http';
import dateFormat from './plugins/dateFormat';
import sourceAgent from './plugins/sourceAgent';
import executor from './plugins/executor';

Vue.use(FibricUi, { size: 'sm' });
Vue.use(FibricUiWeb);
Vue.use(http, { router });
Vue.use(dateFormat);
Vue.use(sourceAgent);
Vue.use(executor);

import Breadcrumb from './components/utils/Breadcrumb.vue';
import List from './components/utils/List.vue';
import Dialog from './components/utils/Dialog.vue';
import Panel from './components/utils/Panel.vue';

Vue.component('custom-breadcrumb', Breadcrumb);
Vue.component('custom-list', List);
Vue.component('custom-dialog', Dialog);
Vue.component('custom-panel', Panel);

import * as product from './product';

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

		},
		reporter: {

		},
		beforeAppMount(handler) {
			context.beforeAppMountHandler.push(handler);
		}
	});
});

Vue.prototype.$product = context.product;
Vue.prototype.$fabric.icon.dropdown = 'ms-Icon ms-Icon--CaretSolidDown';

import App from './components/App';
import store from './store';


const mask = document.createElement('div');

mask.id = 'app-product-mask';

router.beforeEach((to, from, next) => {
	if (to.matched.length === 0) {
		return next('/workbench/welcome');
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

context.beforeAppMountHandler.forEach(handler => handler(app));
window.addEventListener('load', async function () {
	document.body.append(mask);

	const { $http } = Vue;
	const product = await $http.product.get();

	document.title = product.name;

	app.$mount('#app');
});