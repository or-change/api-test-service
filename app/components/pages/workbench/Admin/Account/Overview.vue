<template>
	<div>
		<custom-breadcrumb
			:items="[
				{
					text: '管理员平台',
					href: '#/workbench/admin/configuration'
				},
				{
					text: '用户管理',
					href: '#/workbench/admin/account'
				}
			]"
			/>
		
		<f-row class="ms-my-3" style="position: relative">
			<div class="button-group">
				<f-button
					class="button-danger"
					text="删除"
					variant="primary"
					:disabled="!selectedAccount || selectedAccount.length === 0"
					@click="deleteAccount"
				/>
			</div>
			<f-col col="2" sm="4" md="4" lg="2">
				<f-text-field
					label="用户名"
					placeholder="输入查找用户名"
					v-model="filter.name" />
			</f-col>
			<f-col col="2" sm="4" md="4" lg="2" class="ms-ml-3">
				<f-label>管理员身份</f-label>
				<f-dropdown
					:options="[
						{
							text: '是',
							value: 1
						},
						{
							text: '否',
							value: -1
						}
					]"
					placeholder="选择项目负责人"
					v-model="filter.admin"
					multi-select
				/>
			</f-col>
			<f-button 
				text="新建"
				variant="primary"
				@click="show = true"
				style="margin-top: 18px;"
				class="ms-ml-3"
			/>
		</f-row>

		<custom-list
			:fields="fields"
			:items="filteredAccountList"
			:select-mode="filteredAccountList.length !== 0 ? 'multi' : 'single'"
			v-model="selectedAccount"
		>
			<template slot="row-name" slot-scope="props">
				<f-link
					:href="`#/workbench/admin/account/${props.value.id}`"
				>{{props.value.name}}</f-link>
			</template>

			<template slot="row-administrator" slot-scope="props">
				<span>{{props.value.administrator ? '是' : '否'}}</span>
			</template>
		</custom-list>

		<custom-dialog
			id="create-account"
			v-model="show" 
			title="新建用户"
			ok-text="创建"
			@ok="addAccount"
		>
			<f-text-field
				label="名称："
				placeholder="account 1"
				underline
				v-model="account.name"
				required
			/>
			<f-text-field
				class="ms-mt-2"
				label="邮箱："
				placeholder="email 1"
				underline
				v-model="account.email"
				required
			/>
			<div>
				<f-label class="ms-my-2">管理员：</f-label>
				<f-dropdown
					:options="[
						{
							text: '是',
							value: 1
						},
						{
							text: '否',
							value: -1
						}
					]"
					placeholder="选择项目负责人"
					v-model="account.administrator"
				/>
			</div>
		</custom-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			selectedAccount: [],
			accountList: [],
			filter: {
				name: '',
				admin: []
			},
			fields: [
				{
					label: 'Name',
					key: 'name'
				},
				{
					label: 'Email',
					key: 'email'
				},
				{
					label: 'Admin',
					key: 'administrator'
				}
			],
			account: {
				name: '',
				email: '',
				administrator: -1
			}
		}
	},
	computed: {
		filteredAccountList() {
			let filteredAccount = this.accountList;

			if (this.filter.name) {
				const nameReg = new RegExp(this.filter.name);

				filteredAccount = filteredAccount
					.filter(account => nameReg.test(account.name));
			}

			if (this.filter.admin.length !== 0) {
				filteredAccount = filteredAccount
					.filter(account => this.filter.admin.indexOf(account.administrator ? 1 : -1) !== -1);
			}

			return filteredAccount;
		}
	},
	watch: {
		show() {
			if (!this.show) {
				this.account.name = '';
			}
		}
	},
	methods: {
		async deleteAccount() {
			await Promise.all(this.selectedAccount.map(account => {
				return this.$http.admin.account.delete(account.id);
			}));

			await this.getAccount();
			this.selectedAccount = [];
		},
		async addAccount() {
			const { name, email, administrator } = this.account;
			await this.$http.admin.account.create({
				name, email, administrator: !!administrator
			});

			this.show = false;
			this.getAccount();
		},
		async getAccount() {
			this.accountList = await this.$http.account.query();
		}
	},
	mounted () {
		this.getAccount();
	}
}
</script>

