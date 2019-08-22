<template>

</template>

<script>
export default {
	data() {
		return {
			projectList: [],
			show: false,
			selectOwner: null,
			accountList: [],
			selectedProject: [],
			filter: {
				name: null,
				owner: []
			}
		}
	},
	computed: {
		ownerList() {
			return this.accountList.map(account => {
				return {
					text: account.name,
					value: account.id
				};
			})
		},
		filteredProjectList() {
			return this.projectList.map(project => {
				const account = this.accountList.find(account => account.id === project.ownerId);

				if (account) {
					project.owner = account.name;
				}

				return project;
			}).filter((project) => {
				const { name, owner } = this.filter;

				const nameFilter = name ? new RegExp(name).test(project.name) : true;
				const ownerFilter = owner.length ? owner.indexOf(project.ownerId) !== -1 : true;

				return nameFilter && ownerFilter;
			}).sort((a, b) => {
				return new Date(b.createdAt) - new Date(a.createdAt);
			});
		}
	},
	watch: {
		show() {
			if (!this.show) {
				this.selectOwner = null;
			}
		}
	},
	methods: {
		async queryProject() {
			this.projectList = await this.$http.admin.project.query();
		},
		async assignOwner() {
			if (this.selectedProject.length === 0 || this.selectOwner === null) {
				this.show = false;
			}

			await Promise.all(this.selectedProject
				.map(project => this.$http.admin.project.assign(project.id, this.selectOwner)));

			this.show = false;
			await this.queryProject();
		},
		async getAccountList() {
			this.accountList = await this.$http.account.query();
		}
	},
	mounted() {
		this.queryProject();
		this.getAccountList();
	}
}
</script>


