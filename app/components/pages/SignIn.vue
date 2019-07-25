<template>
	
<div style="width: 1200px;margin: auto">
		<f-row>
			<f-col offset="4" col="4" style="background:#ccc">
				<form class="m-p-2">
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
						@click.native="signIn"
						variant="primary"
						text="Sign In"
					/>
				</form>
			</f-col>
		</f-row>
</div>

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
			try {
				await this.$store.dispatch('signin', this.credential);
				this.$router.push('/workbench/portal');
			} catch (error) {

			}
		}
	}
}
</script>

