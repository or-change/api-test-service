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
					text: source.semver,
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
import mixin from './mixin';

export default {
	mixins: [mixin],
	computed: {
		executionId() {
			return this.$route.params.executionId;
		}
	}
}
</script>

