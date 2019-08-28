const STATUS = {
	'-1': '空闲',
	'0': '拉取代码',
	'1': '安装',
	'2': '正在运行',
	'3': '结束'
};

export default {
	data() {
		return {
			totalRow: 0,
			perPage: 10,
			currentPage: 1,
			keyword: ''
		};
	},
	props: {
		items: {
			type: Array,
			default: () => []
		}
	},
	watch: {
		items() {
			this.totalRow = this.items.length;
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
	methods: {
		deleteExecution() {
			this.$emit('delete', this.selected);
			this.selected = [];
		},
		onFiltered(filteredItems) {
			this.totalRow = filteredItems.length;
			this.currentPage = 1;
		}
	}
};