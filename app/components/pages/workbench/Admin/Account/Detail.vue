<template>
	<div>
		<custom-breadcrumb
			:items="[
				{
					text: '管理员平台',
					href: '#/workbench/admin/configuration'
				},
				{
					text: account.name ? account.name : `用户: ${accountId}`,
					href: '#/workbench/admin/project'
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
								value: '1'
							},
							{
								text: '否',
								value: '-1'
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

				<f-label :class="['field-label', message.state]">
					{{ message.content }}</f-label>
			</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			account: {
				name: '',
				administrator: '-1'
			}
		}
	},
	computed: {
		accountId() {
			return this.$route.params.accountId;
		}
	},
	methods: {
		getAccount() {
			this.$http.account.get(this.accountId).then(res => {
				const { name, administrator } = res.data;

				this.account.name = name;
				this.account.administrator = administrator ? '1' : '-1';
			});
		},
		updateAccount() {
			this.resetMessage();

			this.$http.account.update({
				administrator: this.account.administrator === '1' ? true : false
			}).then(res => {
				this.getAccount();

				this.setMessage('success', '用户更新成功！');
			}).catch(() => {
				this.setMessage('fail', '用户更新失败！');
			});
		}
	},
	mounted() {
		return this.getAccount();
	}
}
</script>

<style lang="scss">
.field-label {
	display: inline;
	height: 26px;
	line-height: 26px;
	vertical-align:top
}
</style>


