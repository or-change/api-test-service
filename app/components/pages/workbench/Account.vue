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
				<div id="placeholder"></div>
				<br />
				<f-button
					class="ms-mt-3"
					variant="primary"
					text="更换头像"
					@click="changePortrait"
				/>
			</f-col>
			<f-col col="8" class="ms-ml-5">
				<f-row class="ms-pt-3">
					<f-col col="3">
						<f-text-field
							label="姓名"
							placeholder="输入用户姓名"
							underline
							@focus="resetMessage"
							v-model="account.name" />
					</f-col>
					<f-col col="3" offset="1">
						<f-text-field
							label="邮箱"
							placeholder="输入用户邮箱"
							underline
							@focus="resetMessage"
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
				<f-label :class="message.state">{{ message.content }}</f-label>
			</f-col>
		</f-row>
	</div>
</template>

<script>
export default {
	data() {
		return {
			account: {
				name: '',
				email: '',
				administrator: false
			},
			message: {
				state: '',
				content: ''
			}
		}
	},
	computed: {
		accountId() {
			return this.$store.state.principal.id;
		}
	},
	methods: {
		getAccount() {
			this.$http.account.get(this.accountId).then(res => {
				this.account = res.data;
			})
		},
		changePortrait() {

		},
		updateAccount() {
			this.resetMessage();

			this.$http.account.update(this.account).then(() => {
				this.setMessage('success', '用户更新成功！');
			}).catch(() => {
					this.setMessage('fail', '用户更新失败！');
			});
		},
		resetMessage() {
			this.message.state = '';
			this.message.content = '';
		}
	},
	mounted() {
		this.getAccount();
	}
}
</script>

<style lang="scss">
#placeholder {
	display: inline-block;
	width: 100px;
	height: 100px;
	background-color: grey;
}

#account-detail {
	.ms-row {
		height: 100%;

		.ms-col {
			height: 100%;
		}
	}
}
</style>


