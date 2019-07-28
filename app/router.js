import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import SignIn from './components/pages/SignIn';
import Workbench from './components/pages/Workbench';
import WorkbenchPortal from './components/pages/workbench/Portal';
import WorkbenchAdmin from './components/pages/workbench/Admin';
import WorkbenchPlugin from './components/pages/workbench/Plugin';

import WorkbenchProject from './components/pages/workbench/Project/Overview';
import WorkbenchProjectDetail from './components/pages/workbench/Project/Detail';
import WorkbenchProjectSource from './components/pages/workbench/Project/Source/Overview';
import WorkbenchProjectSourceDetail from './components/pages/workbench/Project/Source/Detail';

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
					unauthencated: true
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
						path: 'project/:projectId',
						component: WorkbenchProjectDetail
					},
					{
						path: 'project/:projectId/source',
						component: WorkbenchProjectSource
					},
					{
						path: 'project/:projectId/source/:sourceId',
						component: WorkbenchProjectSourceDetail
					},
					{
						path: 'admin',
						component: WorkbenchAdmin,
						meta: {
							admin: true
						}
					},
					{
						path: 'plugin',
						component: WorkbenchPlugin,
						meta: {
							admin: true
						}
					}
				].concat(pluginRouterOptions)
			},
		],
	});

	return router;
}