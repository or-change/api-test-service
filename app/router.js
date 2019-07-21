import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default function Router(pluginRouterOptions) {
	return new VueRouter({
		routes: [
			{
				path: '/signin'
			},
			{
				path: '/workbench',
				children: [
					{
						path: '/portal'
					},
					{
						path: '/project'
					},
					{
						path: '/version'
					},
					{
						path: '/plugin'
					}
				].concat(pluginRouterOptions)
			}
		]
	});
}