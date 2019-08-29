import Global from './Global.vue';
import Detail from './Detail.vue';

window.product.use(function ({executor}) {
	executor('ecma.mocha.basic.local', {
		description: '一般执行器',
		global: Global,
		detail: Detail
	});
});