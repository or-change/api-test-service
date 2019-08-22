<template>

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
				// {
				// 	text: '总览',
				// 	href: '#/workbench/admin/overview',
				// 	icon: null
				// }
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
			
			this.$router.push('/signin');
		}
	}
}
</script>

<style lang="scss">
nav {
	display: table;
}

.ms-navbar-brand {
	display: table-cell;
}

.ms-navbar .ms-navbar-collapse {
	display: table-cell !important;
	width: 100%;
}
</style>
