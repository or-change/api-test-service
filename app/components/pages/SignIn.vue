<template>

<f-container>
	<f-row>
		<f-col offset="5" col="2" style="margin-top: 200px;">
			<form class="ms-p-2 ms-bordered">
				<f-text-field
					class="ms-mb-2"
					label="用户名"
					required
					v-model="credential.username"
				/>
				<f-text-field
					class="ms-mb-2"
					label="密码"
					type="password"
					required
					v-model="credential.password"
				/>
				<f-button
					:disabled="!credential.username || !credential.password"
					@click="signIn"
					variant="primary"
					text="Sign In"
				/>
			</form>
		</f-col>
	</f-row>
</f-container>

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

