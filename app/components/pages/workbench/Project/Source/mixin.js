export default {
	data() {
		return {
			source: {},
			projectName: null
		};
	},
	computed: {
		sourceId() {
			return this.$route.params.sourceId;
		},
		projectId() {
			return this.$route.params.projectId;
		}
	},
	methods: {
		async getProject() {
			const project = await this.$http.project.get(this.projectId);

			this.projectName = project.name;
		},
		async getSource() {
			this.source = await this.$http.project.source(this.projectId).get(this.sourceId);
		}
	},
	mounted() {
		this.getProject();
		this.getSource();
	}
};