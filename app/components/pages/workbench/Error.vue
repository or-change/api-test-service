<template>
	<b-jumbotron
		class="mt-4" bg-variant="danger" text-variant="white"
		header="错误信息" :lead="errorMessage">
		<b-button variant="light" to="/" size="sm">返回首页</b-button>
	</b-jumbotron>
</template>

<script>
export default {
	computed: {
		errorMessage() {
			return this.$route.query.error;
		}
	}
}
</script>