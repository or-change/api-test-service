<template>
	
<div>
	<f-navbar
		fixed
	>
		<f-navbar-brand>Navbar test</f-navbar-brand>
		
		<f-navbar-nav>
			<f-nav-button
				text="我的总览"
				icon="ms-Icon ms-Icon--Home"
				href="#/workbench/portal"
				tag="a"
			/>
			<f-nav-button
				icon="ms-Icon ms-Icon--ProjectCollection"
				href="#/workbench/project"
				text="我的项目"
				tag="a"
				:dropdown="true"
				split
			>
			</f-nav-button>
		</f-navbar-nav>
		<f-navbar-nav align="right">
			<f-nav-button
				:text="name"
				icon="ms-Icon ms-Icon--Emoji2"
				dropdown
				triangle
				split
				@dropdown.stop="toggleMenu('accountMenu')"
			>
				<f-menu
					slot="menu"
					:menu="[
						{
							text: '1111111111111',
							icon: 'ms-Icon ms-Icon--Emoji',
							href: 'http://www.baidu.com',
						},
						{
							text: '111',
							icon: ''
						}
					]"
					ref="accountMenu"
					style="top:100%"
				/>
			</f-nav-button>
		</f-navbar-nav>
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
		}
	},
	methods: {
		toggleMenu(ref) {
			const menu = this.$refs[ref];

			console.log(menu)

			if (menu.isShow) {
				menu.hide();
			} else {
				menu.show();
			}
		}
	}
}
</script>

<style lang="scss">
#app-workbench-container {
	margin-top: 56px;
}
</style>
