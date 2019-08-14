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
		},
		constructList(tree, result = [], level = 0) {
			tree.children.forEach((node, index) => {
				const info = {
					level,
					only: node.only,
					skip: node.skip,
					title: node.title,
					type: node.type
				};

				if (node.type === 'test') {
					node.path = node.path.join('-');
					node.result = 0;
				} else {
					node.path = `${tree.path}-${index}`;
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