<template>
<f-container id="signin" fluid>
	<f-row>
		<f-col offset="5" col="2" style="margin-top: 300px;">
			<h1>接口测试系统后台登录</h1>
		</f-col>
	</f-row>
	<f-row>
		<f-col offset="5" col="2" style="margin-top: 40px;">
			<form class="ms-p-4 ms-round" id="signin-container">
				<f-text-field
					class="ms-mb-2"
					label="用户名"
					underline
					required
					v-model="credential.username"
				/>
				<f-text-field
					class="ms-mb-2"
					label="密码"
					type="password"
					underline
					required
					v-model="credential.password"
				/>
				<f-button
					:disabled="!credential.username || !credential.password"
					@click="signIn"
					class="ms-mt-3"
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

<style lang="scss">
#signin {
	height: 100%;
	background-color: #004e8c;

	h1 {
		color: #fff;
		opacity: .8;
		text-align: center;
	}
}

#signin-container {
	background-color: #fff;
}
</style>


