import Global from './Global.vue';
import Detail from './Detail.vue';

window.product.use(function ({source}) {
	source('ecma.mocha.basic.local', {
		name: '文件',
		global: Global,
		detail: Detail
	});
});