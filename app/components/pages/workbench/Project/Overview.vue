<template>

	<div>
		<custom-breadcrumb
			:items="[{
				text: '我的项目',
				href: '#/workbench/project'
			}]"
			/>
		
		<f-row class="ms-my-3" style="position: relative">
			<div class="button-group">
				<f-button 
					text="新建"
					variant="primary"
					@click="addProject"
				/>

				<f-button
					class="button-danger"
					text="删除"
					variant="primary"
					:disabled="!selectedProject || selectedProject.length === 0"
					@click="deleteProject"
				/>
			</div>
			<f-col col="2" sm="4" md="4" lg="2">
				<f-text-field
					label="项目名称"
					placeholder="输入查找项目名称"
					v-model="filter.name" />
			</f-col>
		</f-row>

		<custom-list
			:fields="fields"
			:items="filteredProjectList"
			:select-mode="projectList.length !== 0 ? 'multi' : 'single'"
			v-model="selectedProject"
			/>
	</div>
</template>

<script>
import mixin from '../../../mixin/project';

export default {
	data() {
		return {
			projectList: [],
			selectedProject: []
		}
	},
	mixins: [mixin],
	methods: {
		getProject() {
			this.$http.project.query().then((data) => {
				this.projectList = data;
			})
		},
		addProject() {

		},
		deleteProject() {

		},
		changeSelect(value) {
			this.selectedProject = value;
		}
	},
	mounted() {
		this.getProject();
	}
}
</script>

<style lang="scss">
.button-group {
	position: absolute;
	right: 0;
	bottom: 0;
}
</style>



