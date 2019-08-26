<template>
	<b-container style="margin-top: 200px;">
		<b-row>
			<b-col
				cols="4"
				offset="4"
			>
				<b-form @submit.prevent="signIn">
					<b-form-group label="用户名：" label-for="username" label-size="sm">
						<b-form-input id="username" size="sm" trim required
							v-model="credential.username"></b-form-input>
					</b-form-group>

					<b-form-group label="密码：" label-for="password" label-size="sm">
						<b-form-input id="password" size="sm" trim required type="password"
							v-model="credential.password"></b-form-input>
					</b-form-group>

					<b-button type="submit" variant="primary" size="sm">Sign In</b-button>
				</b-form>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
export default {
	data() {
		return {
			credential: {
				username: '',
				password: ''
			}
		}
	},
	methods: {
		async signIn() {
			await this.$store.dispatch('signin', {
				type: 'simple',
				body: this.credential
			});
			this.$router.push('/workbench/welcome');
		}
	}
}
</script>