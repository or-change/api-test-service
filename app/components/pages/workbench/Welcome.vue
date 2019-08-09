<template>
	<custom-panel id="welcome">
		<h1>欢迎 用户 {{ name }} 登录</h1>
		<h2 class="ms-mt-4">登录时间：{{ new Date() | dateFormat }}</h2>

		<hr class="ms-my-5" />

		<p>本系统应用于接口测试项目的统一管理，在线接口测试，接口测试报告在线预览。</p>
	</custom-panel>
</template>

<script>
export default {
	computed: {
		name() {
			return this.$store.state.principal.name;
		}
	}
}
</script>

