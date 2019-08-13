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
			<f-button 
				text="新建"
				variant="primary"
				@click="show = true"
				style="margin-top: 18px;"
				class="ms-ml-3"
			/>
		</f-row>

		<custom-list
			:fields="fields"
			:items="filteredProjectList"
			:select-mode="filteredProjectList.length !== 0 ? 'multi' : 'single'"
			v-model="selectedProject"
		>
			<template slot="row-name" slot-scope="props">
				<f-link
					:href="`#/workbench/project/${props.value.id}`"
				>{{props.value.name}}</f-link>
			</template>

			<template slot="row-createdAt" slot-scope="props">
				{{props.value.createdAt | dateFormat}}
			</template>
		</custom-list>

		<custom-dialog
			id="create-project"
			v-model="show" 
			title="新建项目"
			ok-text="创建"
			@ok="addProject"
		>
			<f-text-field
				label="名称："
				placeholder="project 1"
				underline
				v-model="project.name"
			/>
		</custom-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			projectList: [],
			selectedProject: [],
			project: {
				name: ''
			},
			show: false,
			fields: [
				{
					label: 'Name',
					key: 'name'
				},
				{
					label: 'createdAt',
					key: 'createdAt'
				}
			],
			filter: {
				name: null
			}
		}
	},
	watch:{
		show() {
			if (!this.show) {
				this.project.name = '';
			}
		}
	},
	computed: {
		filteredProjectList() {
			return this.projectList.filter((project) => {
				const { name } = this.filter;

				return name ? new RegExp(name).test(project.name) : true;
			}).sort((a, b) => {
				return b.createdAt - a.createdAt;
			});
		}
	},
	methods: {
		async queryProject() {
			this.projectList = await this.$http.project.query();
		},
		async addProject() {
			const project = await this.$http.project.create(this.project);

			this.show = false;
			this.$router.push(`/workbench/project/${project.id}`);
		},
		async deleteProject() {
			await Promise.all(this.selectedProject.map(project => {
				return this.$http.project.delete(project.id);
			}));

			this.projectList = await this.queryProject();
			this.selectedProject = [];
		}
	},
	mounted() {
		this.queryProject();
	}
}
</script>



