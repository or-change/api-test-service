<template>
	
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


