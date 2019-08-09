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
			<div v-for="(item, index) in abstract">
				<p
					:class="['ms-pb-1', 'ms-textTruncate', 'ms-mt-2']"
					:style="{'padding-left': `${25 * item.level}px`}"
					:title="item.title"
					v-if="item.type === 'suit'"
				>
					{{item.title}}
				</p>

				<f-message-bar
					v-else
					multiLine
					variant="danger"
					class="ms-mt-2"
					toggle
					:text="item.title">
					<div slot="messageBar-text" class="ms-message-bar-text">
						test title
						<p>1111</p>
					</div>
				</f-message-bar>
			</div>
		</div>
	</div>
</template>

<script>
import mixin from './mixin'; 

export default {
	mixins: [mixin],
	data() {
		return {
			execution: {}
		}
	},
	computed: {
		executionId() {
			return this.$route.params.executionId;
		}
	},
	methods: {
		async getExecution() {
			this.execution = await this.$http.project.source(this.projectId).execution(this.sourceId).get(this.executionId);
		}
	},
	mounted() {
		this.getExecution();
	}
}
</script>

<style lang="scss">
#reporter-container {
	.ms-message-bar-single .ms-message-bar-content .ms-message-bar-text p{
		display: none;
	}

	.ms-message-bar-multi .ms-message-bar-content .ms-message-bar-text p {
		display: block;
	}
}
</style>


