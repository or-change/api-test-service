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
					text: '用户列表',
					active: true
				}
			]"
		/>

		<div>
			<label for="account-name" class="align-middle mb-0">搜索关键字：</label>
			<b-form-input
				id="account-name" size="sm" class="d-inline-block align-middle mr-3" style="width: 10em"
				v-model="keyword"
				placeholder="输入查找项目名称"
			></b-form-input>
			<b-button variant="primary" size="sm" v-b-modal.create-account>
				新建
			</b-button>
			<b-button size="sm" variant="danger" @click="deleteAccount"
				:disabled="selectedAccount.length === 0" class="float-right">删除</b-button>
			<b-pagination
				size="sm" class="float-right mr-3 mb-0"
				:total-rows="totalRow" :per-page="perPage"
				v-model="currentPage"
			/>
		</div>

		<custom-table
			ref="accountList" class="mt-3"
			:fields="[
				{ label: '用户名', key: 'name' },
				{ label: '邮箱', key: 'email' },
				{ label: '管理员', key: 'administrator' }
			]"
			:items="accountList"
			:selectable="true"
			:filter="keyword" :filter-function="filter"
			:per-page="perPage" :current-page="currentPage"
			@filtered="onFiltered" v-model="selectedAccount"
		>
			<template slot="[name]" slot-scope="data">
				<b-link class="text-truncate d-inline-block w-100" :title="data.value"
					:to="`/workbench/admin/account/${data.item.id}`">
					{{ data.value }}
				</b-link>
			</template>
			<template slot="[administrator]" slot-scope="data">
				{{ data.value ? '是' : '否' }}
			</template>
		</custom-table>

		<b-modal
			id="create-account" size="sm" title="创建新用户" centered
			button-size="sm" ok-title="创建" cancel-title="取消"
			@ok="addAccount" @hidden="account.name = ''; account.email = ''; account.administrator = false"
			:ok-disabled="!nameState || !emailState"
		>
			<div>
				<label for="name" class="align-middle mb-0">用户名：</label>
				<b-form-input
					id="name" size="sm" class="d-inline-block align-middle" style="width: 14em"
					v-model="account.name" :state="nameState"
					placeholder="输入用户名"
				></b-form-input>
			</div>
			<div class="my-3">
				<label for="email" class="align-middle mb-0">邮箱：</label>
				<b-form-input
					id="email" size="sm" class="d-inline-block align-middle ml-3" style="width: 14em"
					v-model="account.email" :state="emailState"
					placeholder="输入用户邮箱"
				></b-form-input>
			</div>
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
			</div>
		</b-modal>
	</div>
</template>

<script>
export default {
	data() {
		return {
			selectedAccount: [],
			accountList: [],
			keyword: '',
			account: {
				name: '',
				email: '',
				administrator: false
			},
			currentPage: 1,
			totalRow: 0,
			perPage: 10
		}
	},
	computed: {
		nameState() {
			return this.account.name && this.account.name.length > 0 ? true : false;
		},
		emailState() {
			return this.account.email && this.account.email.length > 0 ? true : false;
		}
	},
	methods: {
		onFiltered(filteredItems) {
			this.totalRow = filteredItems.length;
      this.currentPage = 1;
		},
		filter(item, keyword) {

		},
		async deleteAccount() {
			await Promise.all(this.selectedAccount.map(id => {
				return this.$http.admin.account.delete(id);
			}));

			await this.getAccount();
			this.selectedAccount = [];
		},
		async addAccount() {
			const { name, email, administrator } = this.account;
			await this.$http.admin.account.create({
				name, email, administrator: administrator
			});

			this.getAccount();
		},
		async getAccount() {
			this.accountList = await this.$http.account.query();

			this.totalRow = this.accountList.length;
		}
	},
	mounted () {
		this.getAccount();
	}
}
</script>

