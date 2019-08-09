function constructList(tree, result = [], level = 0) {
	tree.children.forEach(node => {
		result.push({
			level,
			only: node.only,
			skip: node.skip,
			title: node.title,
			type: node.type
		});

		if (node.children) {
			const newLevel = level + 1;

			constructList(node, result, newLevel);
		}
	});

	return result;
}

export default {
	data() {
		return {
			source: {},
			projectName: null
		};
	},
	computed: {
		abstract() {
			if (this.source.structure) {
				return constructList(this.source.structure);
			}

			return [];
		},
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