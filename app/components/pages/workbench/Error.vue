<template>
	<custom-panel id="error">
		<f-row>
			<f-col col="8">
				<h1>操作失败：</h1>
				<h2 class="ms-my-4">{{ errorMessage }}</h2>

				<f-button 
					variant="primary"
					icon="ms-Icon ms-Icon--ChevronLeftEnd6"
					text="返回上一页"
					@click="back"
				/>
			</f-col>
			<f-col col="4">
				<i class="ms-Icon ms-Icon--ErrorBadge" id="error-symbol"></i>
			</f-col>
		</f-row>
	</custom-panel>
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
		font-size: 160px;
		color: #a4262c;
	}
}
</style>

