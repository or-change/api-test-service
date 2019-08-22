<template>
	
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
			account: {
				name: '',
				email: '',
				administrator: -1
			}
		}
	},
	computed: {
		filteredAccountList() {
			return this.accountList.filter((account) => {
				const { name, admin } = this.filter;

				const nameFilter = name ? new RegExp(name).test(account.name) : true;
				const adminFilter = admin.length ? admin.indexOf(account.administrator ? 1 : -1) !== -1 : true ;

				return nameFilter && adminFilter;
			});
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

