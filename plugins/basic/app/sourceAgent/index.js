import AdminSourceConfig from './Admin.vue';
import CreateSourceConfig from './Create.vue';

window.product.use(function ({source}) {
	source.add('ecma.mocha.basic.local', {
		name: '文件',
		admin: AdminSourceConfig.name,
		create: CreateSourceConfig.name
	});
});

export default function install(Vue) {
	Vue.component(AdminSourceConfig.name, AdminSourceConfig);
	Vue.component(CreateSourceConfig.name, CreateSourceConfig);
}