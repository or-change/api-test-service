<template>
<div>
	<f-navbar
		fixed
	>
		<f-navbar-brand>接口测试产品后台</f-navbar-brand>

		<f-navbar-toggle target="navbar" />

		<f-navbar-collapse id="navbar">
			<f-navbar-nav>
				<!-- <f-nav-item>
					<f-nav-link
						href="#/workbench/portal"
					>
						<i class="ms-Icon ms-Icon--AllApps"></i>
						我的概览
					</f-nav-link>
				</f-nav-item> -->
				<f-nav-item>
					<f-nav-link
						href="#/workbench/project"
					>
						<i class="ms-Icon ms-Icon--ProjectCollection"></i>
						我的项目
					</f-nav-link>
				</f-nav-item>
			</f-navbar-nav>
			
			<f-navbar-nav align="right">
				<f-nav-button
					:text="`${name}`"
					dropdown
					triangle
					icon="ms-Icon ms-Icon--AccountManagement"
					@click.stop="toggleMenu('accountMenu')"
				>
					<f-menu
						slot="menu"
						size="md"
						ref="accountMenu"
						style="top:100%"
						direction="left"
					>
						<template slot="menu-body">
							<f-menu-item
								:options="{
									text: '我的信息',
									href: '#/workbench/account'
								}"
								/>
							<f-menu-sub-item
								v-if="isAdmin"
								id="sub-menu"
								:options="{
									subMenu: menu,
									size:'md',
									text: '管理员平台',
									href: '#/workbench/admin/configuration'
								}"
								/>
							<f-menu-item
								:options="{
									text: '退出'
								}"
								@actived="signOut"
								/>
						</template>
					</f-menu>
				</f-nav-button>
			</f-navbar-nav>
		</f-navbar-collapse>
	</f-navbar>

	<f-container id="app-workbench-container" class="ms-pt-3">
		<router-view>what</router-view>
	</f-container>
</div>

</template>

<script>
export default {
	data() {
		return {
			menu: [
				{
					text: '用户管理',
					href: '#/workbench/admin/account',
					icon: null
				},
				{
					text: '项目管理',
					href: '#/workbench/admin/project',
					icon: null
				},
				{
					text: '总览',
					href: '#/workbench/admin/overview',
					icon: null
				}
			]
		};
	},
	computed: {
		name() {
			return this.$store.state.principal.name;
		},
		isAdmin() {
			return this.$store.state.principal.administrator;
		}
	},
	methods: {
		toggleMenu(ref) {
			const menu = this.$refs[ref];

			if (menu.isShow) {
				menu.hide();
			} else {
				menu.show();
			}
		},
		async signOut() {
			await this.$store.dispatch('signout')
			
			this.$router.push('/');
		}
	}
}
</script>
