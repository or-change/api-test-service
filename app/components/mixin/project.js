export default {
	data() {
		return {
			fields: [
				{
					label: 'ID',
					key: 'id'
				},
				{
					label: 'Name',
					key: 'name'
				},
				{
					label: 'Owner',
					key: 'owner'
				}
			],
			selectedProject: null,
			filter: {
				name: null,
				owner: []
			}
		};
	},
	computed: {
		filteredProjectList() {
			let filteredProject = this.projectList;

			
			if (this.filter.name) {
				const nameReg = new RegExp(this.filter.name);

				filteredProject = filteredProject
					.filter(project => nameReg.test(project.name));

			}
				
			if (this.filter.owner && this.filter.owner.length !== 0) {
				filteredProject = filteredProject
					.filter(project => this.filter.owner.indexOf(project.owner) !== -1);
			}
			
			return filteredProject;
		},
		ownerList() {
			return this.projectList.map(project => {
				return {text: project.owner, value: project.owner};
			});
		}
	}
};