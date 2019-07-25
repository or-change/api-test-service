import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import SignIn from './components/pages/SignIn';
import Workbench from './components/pages/Workbench';
import WorkbenchPortal from './components/pages/workbench/Portal';
import WorkbenchSource from './components/pages/workbench/Source';
import WorkbenchProject from './components/pages/workbench/Project';

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
						path: 'project',
						component: WorkbenchProject
					},
					{
						path: 'source',
						component: WorkbenchSource
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