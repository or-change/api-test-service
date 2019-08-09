import AdminExecutorConfig from './Admin.vue';
import CreateExecutorConfig from './Create.vue';

window.product.use(function ({executor}) {
	executor.add('basic.local', {
		name: '一般执行器',
		admin: AdminExecutorConfig.name,
		create: CreateExecutorConfig.name
	});
});

export default function install(Vue) {
	Vue.component(AdminExecutorConfig.name, AdminExecutorConfig);
	Vue.component(CreateExecutorConfig.name, CreateExecutorConfig);
}