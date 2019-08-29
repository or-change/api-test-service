import * as product from '../product';

export default function install(Vue) {
	Vue.prototype.$product = product.store;
}