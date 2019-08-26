<template>
	<div class="mt-3">
		<b-breadcrumb
			:items="[
				{
					to: '/',
					html: '<i class=\'fas fa-home\' />'
				},
				{
					to: '/workbench/account',
					text: '我的信息',
					active: true
				}
			]"
		/>

		<b-row>
			<b-col cols="1" style="text-align: center">
				<div id="placeholder">
					<i class="fas fa-user" style="color: #004e8c;font-size:80px"></i>
				</div>
				<!-- <b-button class="mt-2" variant="primary" size="sm"
					@click="changePortrait"
				>
					更换
				</b-button> -->
			</b-col>
			<b-col cols="8">
				<label for="name" class="align-middle mb-0">用户名：</label>
				<b-form-input
					id="name" size="sm" class="d-inline-block align-middle mr-3" style="width: 10em"
					v-model="account.name" :state="nameState"
					placeholder="输入用户名"
				></b-form-input>
				<label for="email" class="align-middle mb-0">邮箱：</label>
				<b-form-input
					id="email" size="sm" class="d-inline-block align-middle mr-3" style="width: 15em"
					v-model="account.email" :state="emailState"
					placeholder="输入用户邮箱"
				></b-form-input>
				<label for="admin" class="align-middle mb-0">管理员：</label>
				<b-form-input
					id="admin" size="sm" class="d-inline-block align-middle mr-3" style="width: 5em"
					:value="account.administrator ? '是' : '否'"
					readonly
				></b-form-input>

				<b-button variant="primary" size="sm" @click="updateAccount" :disabled="!nameState || !emailState">更新</b-button>
			</b-col>
		</b-row>
	</div>
</template>

<script>
export default {
	data() {
		return {
			account: {}
		}
	},
	computed: {
		accountId() {
			return this.$store.state.principal.id;
		},
		nameState() {
			return this.account.name && this.account.name.length > 0 ? true : false;
		},
		emailState() {
			return this.account.email && this.account.email.length > 0 ? true : false;
		}
	},
	methods: {
		async getAccount() {
			this.account = await this.$http.account.get(this.accountId);
		},
		changePortrait() {
			// 换头像
		},
		async updateAccount() {
			await this.$http.account.update(this.account.id, this.account);
			await this.getAccount();
		}
	},
	mounted() {
		this.getAccount();
	}
}
</script>


