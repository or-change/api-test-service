<template>
	<div id="account-detail">
		<custom-breadcrumb
			:items="[
				{
					text: '我的信息',
					href: '#/workbench/account'
				}
			]"
			/>
		<f-row>
			<f-col col="1" style="text-align: center">
				<div id="placeholder">
					<i class="ms-Icon ms-Icon--Contact" style="color: #004e8c;font-size:100px"></i>
				</div>
				<br />
				<!-- <f-button
					class="ms-mt-3"
					variant="primary"
					text="更换头像"
					@click="changePortrait"
				/> -->
			</f-col>
			<f-col col="8" class="ms-ml-5">
				<f-row class="ms-pt-3">
					<f-col col="3">
						<f-text-field
							label="姓名"
							placeholder="输入用户姓名"
							underline
							v-model="account.name" />
					</f-col>
					<f-col col="3" offset="1">
						<f-text-field
							label="邮箱"
							placeholder="输入用户邮箱"
							underline
							v-model="account.email" />
					</f-col>
					<f-col col="2" offset="1">
						<f-text-field
							label="管理员"
							placeholder="是否为管理员"
							underline
							readonly
							v-model="account.administrator ? '是' : '否'" />
					</f-col>
					<f-col col="1" offset="1">
						<f-button variant="primary" text="更新" @click="updateAccount" />
					</f-col>
				</f-row>
			</f-col>
		</f-row>
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


