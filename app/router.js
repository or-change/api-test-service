import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import SignIn from './components/pages/SignIn';
import Workbench from './components/pages/Workbench';

import WorkbenchProject from './components/pages/workbench/Project/Overview';
import WorkbenchWelcome from './components/pages/workbench/Welcome';
import WorkbenchError from './components/pages/workbench/Error';
import WorkbenchAccount from './components/pages/workbench/Account.vue';

import WorkbenchProjectDetail from './components/pages/workbench/Project/Detail/Detail.vue';
import WorkbenchProjectSourceDetail from './components/pages/workbench/Project/Source/detail/Detail.vue';
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
				redirect: '/workbench/welcome'
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
						path: 'welcome',
						component: WorkbenchWelcome
					},
					{
						path: 'error',
						component: WorkbenchError
					},
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