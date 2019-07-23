import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import SignIn from './components/pages/SignIn';
import Workbench from './components/pages/Workbench';
import WorkbenchPortal from './components/pages/workbench/Portal';

export default function Router(pluginRouterOptions) {
	const router = new VueRouter({
		fallback: true,
		routes: [
			{
				path: '/',
				redirect: '/workbench/portal'
			},
			{
				path: '/signin',
				component: SignIn,
				meta: {
					unauthencated: false
				},
			},
			{
				path: '/workbench',
				meta: {
					authencated: true
				},
				component: Workbench,
				children: [
					{
						path: 'portal',
						component: WorkbenchPortal
					},
					{
						path: 'project'
					},
					{
						path: 'version'
					},
					{
						path: 'plugin'
					}
				].concat(pluginRouterOptions)
			},
		],
	});

	return router;
}