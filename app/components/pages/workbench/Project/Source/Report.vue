<template>
	<div id="reporter-container">
		<custom-breadcrumb
			:items="[
				{
					text: '我的项目',
					href: '#/workbench/project'
				},
				{
					text: projectName ? projectName : projectId,
					href: `#/workbench/project/${projectId}`
				},
				{
					text: '源代码',
					href: `#/workbench/project/${projectId}`
				},
				{
					text: semver,
					href: `#/workbench/project/${projectId}/source/${sourceId}`
				},
				{
					text: '报告',
					href: `#/workbench/project/${projectId}/source/${sourceId}/execution/${executionId}/reporter`
				}
			]"
		/>

		<div class="ms-py-3 ms-px-3">
			<h3>111</h3>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			semver: null,
			projectName: null
		}
	},
	computed: {
		sourceId() {
			return this.$route.params.sourceId;
		},
		projectId() {
			return this.$route.params.projectId;
		},
		executionId() {
			return this.$route.params.executionId;
		}
	},
	methods: {
		getProject() {
			this.$http.project.get(this.projectId)
				.then(res => {
					this.projectName = res.data.name;
				})
		},
		getSource() {
			this.$http.project.source(this.projectId).get(this.sourceId)
				.then(res => {
					this.semver = res.data.semver;
				});
		},
		getReporter() {
			this.$http.project.source(this.projectId).source(this.sourceId)
				.report(this.executionId)
				.then(res => {

				});
		}
	},
	mounted() {
		this.getProject();
		this.getSource();
	}
}
</script>

<style lang="scss">
#reporter-container {
	// h3 {
	// 	text-align: center;
	// }
}
</style>

