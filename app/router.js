import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import SignIn from './components/pages/SignIn';
import Workbench from './components/pages/Workbench';
// import WorkbenchPortal from './components/pages/workbench/Portal';


import WorkbenchProject from './components/pages/workbench/Project/Overview';

import WorkbenchAccount from './components/pages/workbench/Account.vue';
import WorkbenchProjectDetail from './components/pages/workbench/Project/Detail';
// import WorkbenchProjectSource from './components/pages/workbench/Project/Source/Overview';
import WorkbenchProjectSourceDetail from './components/pages/workbench/Project/Source/Detail';
import WorkbenchProjectReporter from './components/pages/workbench/Project/Source/Report.vue';

import WorkbenchAdmin from './components/pages/workbench/Admin/Admin.vue';
import WorkbenchAdminAccount from './components/pages/workbench/Admin/Account/Overview.vue';
import WorkbenchAdminAccountDetail from './components/pages/workbench/Admin/Account/Detail.vue';
import WorkbenchAdminProject from './components/pages/workbench/Admin/Project.vue';
import WorkbenchAdminOverview from './components/pages/workbench/Admin/Overview.vue';
import WorkbenchConfiguration from './components/pages/workbench/Admin/Configuration.vue';

export default function Router(pluginRouterOptions) {
	const router = new VueRouter({
		fallback: true,
		routes: [
			{
				path: '/',
				redirect: '/workbench/project'
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
					// {
					// 	path: 'portal',
					// 	component: WorkbenchPortal
					// },
					{
						path: 'account',
						component: WorkbenchAccount
					},
					{
						path: 'project',
						component: WorkbenchProject
					},
					{
						path: 'project/:projectId',
						component: WorkbenchProjectDetail
					},
					// {
					// 	path: 'project/:projectId/source',
					// 	component: WorkbenchProjectSource
					// },
					{
						path: 'project/:projectId/source/:sourceId',
						component: WorkbenchProjectSourceDetail
					},
					{
						path: 'project/:projectId/source/:sourceId/execution/:executionId/reporter',
						component: WorkbenchProjectReporter
					},
					{
						path: 'admin',
						component: WorkbenchAdmin,
						meta: {
							admin: true
						},
						children: [
							{
								path: 'account',
								component: WorkbenchAdminAccount
							},
							{
								path: 'account/:accountId',
								component: WorkbenchAdminAccountDetail
							},
							{
								path: 'project',
								component: WorkbenchAdminProject
							},
							{
								path: 'overview',
								component: WorkbenchAdminOverview
							},
							{
								path: 'configuration',
								component: WorkbenchConfiguration
							}
						]
					}
				].concat(pluginRouterOptions)
			},
		],
	});

	return router;
}