<template>
	
</template>

<script>
export default {
	computed: {
		errorMessage() {
			return this.$route.query.error;
		}
	},
	methods: {
		back() {
			return this.$router.go(-1);
		}
	}
}
</script>


<style lang="scss">
#error {
	#error-symbol {
		font-size: 130px;
		color: #a4262c;
	}
}
</style>

