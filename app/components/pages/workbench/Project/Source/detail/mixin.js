const STATUS = {
	'-1': '空闲',
	'0': '拉取代码',
	'1': '安装',
	'2': '正在运行',
	'3': '结束'
};

export default {
	props: {
		projectId: {
			default: null
		},
		sourceId: {
			default: null
		}
	},
	filters: {
		statusFilter(value) {
			return STATUS[value];
		},
		executorFilter(value, product) {
			return product.executor[value] ? product.executor[value].name : value;
		}
	},
	computed: {
		status() {
			const statusValue = Object.keys(STATUS);

			return statusValue.map(status => {
				return {
					value: Number(status),
					text: STATUS[status]
				};
			});
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