import adminScannerConfig from './Admin.vue';
import createScannerConfig from './Create.vue';

window.product.use(function ({scanner}) {
	scanner.add('ecma.mocha.basic.local', {
		name: 'mocha',
		admin: adminScannerConfig.name,
		create: createScannerConfig.name
	});
});

export default function install(Vue) {
	Vue.component(adminScannerConfig.name, adminScannerConfig);
	Vue.component(createScannerConfig.name, createScannerConfig);
}