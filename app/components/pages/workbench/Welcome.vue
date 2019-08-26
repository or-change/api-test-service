<template>
	<b-jumbotron id="welcome" class="mt-4">
		<template slot="header">
			<h1>欢迎 用户 {{ name }} 登录</h1>
		</template>

    <template slot="lead">
			<h2 class="mt-4">登录时间：{{ new Date() | dateFormat }}</h2>
    </template>


		<hr class="my-4">
    <p>
      本系统应用于接口测试项目的统一管理，在线接口测试，接口测试报告在线预览。
    </p>
	</b-jumbotron>
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

<style lang="scss">
#welcome {
	h1, h2 {
		font-weight: 300;
	}
}
</style>

