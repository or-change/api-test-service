export default {
	data() {
		return {
			source: {},
			projectName: null,
			path: 0
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
		},
		constructList(tree, result = [], level = 0) {
			this.path++;

			tree.children.forEach((node, index) => {
				const info = {
					level,
					only: node.only,
					skip: node.skip,
					title: node.title,
					type: node.type
				};

				if (node.type === 'test') {
					info.path = node.path.join('-');
					info.result = 0;
				} else {
					info.path = `suit-${this.path}`;
				}

				result.push(info);
		
				if (node.children) {
					const newLevel = level + 1;
		
					this.constructList(node, result, newLevel);
				}
			});
		
			return result;
		}
	},
	mounted() {
		this.getProject();
		this.getSource();
	}
};