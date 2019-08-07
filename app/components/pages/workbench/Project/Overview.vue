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
			<f-label
				v-show="fail"
				style="color: red"
				class="ms-pt-3"
			>
				创建失败！
			</f-label>
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
			fail: false,
			fields: [
				{
					label: 'Name',
					key: 'name'
				},
				{
					label: 'Owner',
					key: 'owner'
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
				this.fail = false;
			}
		}
	},
	computed: {
		filteredProjectList() {
			let filteredProject = this.projectList;

			
			if (this.filter.name) {
				const nameReg = new RegExp(this.filter.name);

				filteredProject = filteredProject
					.filter(project => nameReg.test(project.name));

			}
				
			return filteredProject.map(project => {
				return {
					id: project.id,
					name: project.name,
					owner: project.owner.name,
					createdAt: project.createdAt
				};
			}).sort((a, b) => {
				return new Date(b.createdAt) - new Date(a.createdAt);
			});
		}
	},
	methods: {
		getProject() {
			this.$http.project.query().then((res) => {
				this.projectList = res.data;
			})
		},
		addProject() {
			this.fail = false;

			this.$http.project.create(this.project)
				.then((res) => {
					this.show = false;
					this.$router.push(`#/workbench/project/${res.data.id}`);
				}).catch(() => {
					this.fail = true;
				});
		},
		deleteProject() {
			Promise.all(this.selectedProject.map(project => {
				return this.$http.project.delete(project.id);
			})).then(() => {
				this.getProject();
				this.selectedProject = [];
			})
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



