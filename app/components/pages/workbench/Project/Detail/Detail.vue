<template>
	<div class="mt-3">
		<b-breadcrumb
			:items="[
				{
					to: '/',
					html: '<i class=\'fas fa-home\' />'
				},
				{
					to: '/workbench/project',
					text: '我的项目'
				},
				{
					to: `/workbench/project/${projectId}`,
					text: projectName ? projectName : projectId,
					active: true
				}
			]"
		/>

		<project-info :project-id="projectId" @inited="(name) => { projectName = name; }" />
		<source-list class="mt-3" @delete="deleteSource" :source-list="sourceList" :project-id="projectId" />

		<b-modal
			ref="show-error" size="md" title="错误信息" centered ok-only
			button-size="sm" ok-title="确定"
		>
			<textarea rows="10" readonly :value="error" style="width: 100%"></textarea>
		</b-modal>

		<upload-dialog :project-id="projectId" @success="getSourceList" />
	</div>
</template>

<script>
import UploadDialog from './Upload';
import ProjectInfo from './Info';
import SourceList from './List';

export default {
	data() {
		return {
			projectName: '',
			error: '',
			sourceList: []
		}
	},
	components: {
		UploadDialog, ProjectInfo, SourceList
	},
	computed: {
		projectId() {
			return this.$route.params.projectId;
		}
	},
	methods: {
		showError(error) {
			if (error) {
				this.error = error;
				this.$refs['show-error'].show();
			}
		},
		async getSourceList() {
			this.sourceList = await this.$http.project.source(this.projectId).query();
		},
		async deleteSource() {
			await Promise.all(this.selectedSourceList.map(id => {
				return this.$http.project.source(this.projectId).delete(id);
			}));

			await this.getSourceList();
			this.selectedSourceList = [];
		}
	},
	mounted() {
		this.getSourceList();
	}
}
</script>
