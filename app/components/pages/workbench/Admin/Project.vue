<template>

	<div>
		<custom-breadcrumb
			:items="[{
				text: '项目管理',
				href: '#/workbench/project'
			}]"
			/>
		
		<f-row class="ms-my-3" style="position: relative">
			<f-col col="2" sm="4" md="4" lg="2">
				<f-text-field
					label="项目名称"
					placeholder="输入查找项目名称"
					v-model="filter.name" />
			</f-col>
			<f-col col="2" sm="4" md="4" lg="2" class="ms-ml-5">
				<f-label>项目负责人</f-label>
				<f-dropdown
					:options="ownerList"
					placeholder="选择项目负责人"
					v-model="filter.owner"
					multi-select
				/>
			</f-col>
		</f-row>

		<custom-list
			:fields="fields"
			:items="filteredProjectList"
			v-model="selectedProject"
			/>
	</div>
</template>

<script>
import mixin from '../../../mixin/project';

export default {
	data() {
		return {
			projectList: []
		}
	},
	mixins: [mixin],
	methods: {
		getProject() {
			this.$http.admin.project.query().then((data) => {
				this.projectList = data;
			})
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



