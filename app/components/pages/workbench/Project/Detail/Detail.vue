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

		<project-info @update="updateProject" v-model="project" />
		
		<b-tabs class="mt-3" content-class="mt-3" small>
			<b-tab title="代码列表" active>
				<source-list @delete="deleteSource" :source-list="sourceList" :project-id="projectId" />
			</b-tab>
			<b-tab title="参与者列表">
				<member-list :project-id="projectId" :owner-id="project.ownerId" />
			</b-tab>
		</b-tabs>

		<upload-dialog :project-id="projectId" @success="getSourceList" />
	</div>
</template>

<script>
import UploadDialog from './Upload';
import ProjectInfo from './Info';
import SourceList from './List';
import MemberList from './Member';

export default {
	data() {
		return {
			projectName: '',
			sourceList: [],
			project: {}
		}
	},
	components: {
		UploadDialog, ProjectInfo, SourceList, MemberList
	},
	computed: {
		projectId() {
			return this.$route.params.projectId;
		}
	},
	methods: {
		async getSourceList() {
			this.sourceList = await this.$http.project.source(this.projectId).query();
		},
		async deleteSource() {
			await Promise.all(this.selectedSourceList.map(id => {
				return this.$http.project.source(this.projectId).delete(id);
			}));

			await this.getSourceList();
			this.selectedSourceList = [];
		},
		async getProject() {
			this.project = await this.$http.project.get(this.projectId);
			this.projectName = this.project.name;
		},
		async updateProject() {
			await this.$http.project.update(this.projectId, {
				name: this.project.name
			});
			
			await this.getProject();
		}
	},
	mounted() {
		this.getProject();
		this.getSourceList();
	}
}
</script>
