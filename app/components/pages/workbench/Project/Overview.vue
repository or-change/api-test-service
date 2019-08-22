<template>

</template>

<script>
export default {
	data() {
		return {
			projectList: [],
			selectedProject: [],
			project: {
				name: 'project 1'
			},
			show: false,
			filter: {
				name: null
			}
		}
	},
	watch:{
		show() {
			if (!this.show) {
				this.project.name = 'project 1';
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



