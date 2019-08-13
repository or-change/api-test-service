export default {
	props: {
		projectId: {
			default: null
		},
		sourceId: {
			default: null
		}
	},
	methods: {
		async deleteExecution() {
			await Promise.all(this.selected.map(execution => {
				return this.$http.project.source(this.projectId).execution(this.sourceId).delete(execution.id);
			}));
	
			this.$emit('delete');
			this.selected = [];
		}
	}
};