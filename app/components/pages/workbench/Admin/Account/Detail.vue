<template>
	<div>
		<custom-breadcrumb
			:items="[
				{
					text: '管理员平台',
					href: '#/workbench/admin/configuration'
				},
				{
					text: '用户列表',
					href: `#/workbench/admin/account`
				},
				{
					text: account.name ? account.name : `用户: ${accountId}`,
					href: `#/workbench/admin/account/${accountId}`
				}
			]"
			/>

			<f-row>
				<f-col col="2">
					<f-label>
						管理员：</f-label>
					<f-dropdown
						:options="[
							{
								text: '是',
								value: 1
							},
							{
								text: '否',
								value: 0
							}
						]"
						placeholder="是否为管理员"
						v-model="account.administrator"
					/>
				</f-col>
			</f-row>
			<div class="ms-mt-2">
				<f-button
					variant="primary"
					text="更新"
					@click="updateAccount"
				/>
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
			this.account.administrator = this.account.administrator ? 1 : 0;
		},
		async updateAccount() {
			await this.$http.admin.account.update(this.accountId, {
				administrator: !!this.account.administrator
			});

			await this.getAccount();
		}
	},
	mounted() {
		return this.getAccount();
	}
}
</script>


