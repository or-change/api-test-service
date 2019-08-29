import Global from './Global.vue';
import Detail from './Detail.vue';

window.product.use(function ({scanner}) {
	scanner('ecma.mocha.basic.local', {
		name: 'mocha',
		global: Global,
		detail: Detail
	});
});