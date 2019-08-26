<template>
	<div class="mt-3">
		<b-breadcrumb
			:items="[
				{
					to: '/',
					html: '<i class=\'fas fa-home\' />'
				},
				{
					to: '/workbench/admin/configuration',
					text: '管理员平台'
				},
				{
					to: '/workbench/admin/account',
					text: '用户列表'
				},
				{
					to: `/workbench/admin/account/${accountId}`,
					text: account.name,
					active: true
				}
			]"
		/>

		<div>
			<label for="admin" class="align-middle mb-0">管理员：</label>
			<b-form-select
				id="admin" size="sm" class="d-inline-block align-middle" style="width: 5em"
				v-model="account.administrator"
				:options="[
					{
						text: '是',
						value: true
					},
					{
						text: '否',
						value: false
					}
				]"
			></b-form-select>
			<b-button variant="primary" size="sm" @click="updateAccount" class="ml-2">更新</b-button>
		</div>
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
			return this.$route.params.accountId;
		}
	},
	methods: {
		async getAccount() {
			this.account = await this.$http.account.get(this.accountId);
		},
		async updateAccount() {
			await this.$http.admin.account.update(this.accountId, {
				administrator: this.account.administrator
			});

			await this.getAccount();
		}
	},
	mounted() {
		return this.getAccount();
	}
}
</script>


