<template>
	<div>
		<b-navbar toggleable="md" type="dark" variant="primary" fixed="top">
			<b-navbar-brand to="/">{{ productName }}</b-navbar-brand>

			<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
			<b-collapse id="nav-collapse" is-nav>
				<b-navbar-nav>
					<!-- <b-nav-item to="/workbench/portal">
						<i class="fas fa-list" /> 我的概览
					</b-nav-item> -->
					<b-nav-item to="/workbench/project">
						<i class="fas fa-folder" /> 我的项目
					</b-nav-item>
				</b-navbar-nav>

				<b-navbar-nav class="ml-auto">
					<b-nav-item-dropdown right>
						<span slot="button-content">
							<i class="fas fa-user" /> {{ principal.name }}
						</span>
						<b-dropdown-item to="/workbench/account">我的信息</b-dropdown-item>
						<b-dropdown-group v-if="principal.administrator">
							<b-dropdown-divider></b-dropdown-divider>
							<b-dropdown-item v-for="(item, index) in [
								{
									text: '后台配置',
									to: '/workbench/admin/configuration'
								},
								{
									text: '用户管理',
									to: '/workbench/admin/account'
								},
								{
									text: '项目管理',
									to: '/workbench/admin/project'
								}
							]" :key="index"
							:to="item.to"
							>{{ item.text }}</b-dropdown-item>
							<b-dropdown-divider></b-dropdown-divider>
						</b-dropdown-group>
						<b-dropdown-item-button @click="signOut">退出</b-dropdown-item-button>
					</b-nav-item-dropdown>
				</b-navbar-nav>
			</b-collapse>
		</b-navbar>

		<b-container id="app-workbench-container">
			<router-view>workbench</router-view>
		</b-container>
	</div>
</template>

<script>
export default {
	data() {
		return {
			productName: 'Examiner'
		}
	},
	computed: {
		principal() {
			return this.$store.state.principal;
		}
	},
	methods: {
		async signOut() {
			await this.$store.dispatch('signout')
			
			this.$router.push('/signin');
		},
		async getProduction() {
			const production = await this.$http.product.get();
			this.productName = production.name;
		}
	},
	mounted() {
		this.getProduction();
	}
}
</script>

<style lang="scss">
#app-workbench-container {
	padding-top: 56px;
}
</style>
