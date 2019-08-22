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


