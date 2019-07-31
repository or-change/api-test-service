<template>
<div>
	<f-navbar
		fixed
	>
		<f-navbar-brand>接口测试产品后台</f-navbar-brand>

		<f-navbar-toggle target="navbar" />

		<f-navbar-collapse id="navbar">
			<f-navbar-nav>
				<f-nav-item>
					<f-nav-link
						href="#/workbench/portal"
					>
						<i class="ms-Icon ms-Icon--AllApps"></i>
						我的概览
					</f-nav-link>
				</f-nav-item>
				<f-nav-item>
					<f-nav-link
						href="#/workbench/project"
					>
						<i class="ms-Icon ms-Icon--ProjectCollection"></i>
						我的项目
					</f-nav-link>
				</f-nav-item>
				<f-nav-item>
					<f-nav-link
						href="#/workbench/portal"
					>
						<i class="ms-Icon ms-Icon--Info"></i>
						我的信息
					</f-nav-link>
				</f-nav-item>
				<f-nav-item>
					<f-nav-link
						href="#/workbench/plugin"
					>
						<i class="ms-Icon ms-Icon--DeveloperTools"></i>
					插件管理
					</f-nav-link>
				</f-nav-item>
				<f-nav-button
					v-if="isAdmin"
					text="管理员平台"
					dropdown
					triangle
					icon="ms-Icon ms-Icon--AccountManagement"
					@click.stop="toggleMenu('adminMenu')"
				>
					<f-menu
						slot="menu"
						size="md"
						:menu="[
							{
								text: '用户管理',
								href: '#/workbench/admin/account',
							},
							{
								text: '项目管理',
								href: '#/workbench/admin/project'
							},
							{
								text: '总览',
								href: '#/workbench/admin/overview'
							}
						]"
						ref="adminMenu"
						style="top:100%"
					/>
				</f-nav-button>
			</f-navbar-nav>
			
			<f-navbar-nav align="right">
				<f-nav-item
					:text="`用户 : ${name} 已登录`"
					/>
				<f-nav-button
					text="退出"
					icon="ms-Icon ms-Icon--SignOut"
					@click="signOut"
					/>
			</f-navbar-nav>
		</f-navbar-collapse>
	</f-navbar>

	<f-container id="app-workbench-container">
		<router-view>what</router-view>
	</f-container>
</div>

</template>

<script>
export default {
	data() {
		return {};
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
		signOut() {
			this.$store.dispatch('signout')
				.then(() => {
					this.$router.go(0); //push无作用
				})
		}
	}
}
</script>

<style lang="scss">
.ms-nav-item {
	.ms-nav-link i {
		vertical-align: top;
	}

	.ms-button-lg a, .ms-button-lg button {
		padding-left: 0px;
	}
}

#app-workbench-container {
	padding-top: 100px;

}
</style>
