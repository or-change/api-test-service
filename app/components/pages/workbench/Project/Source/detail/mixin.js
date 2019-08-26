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
			currentPage: 1
		};
	},
	props: {
		items: {
			type: Array,
			default: () => []
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
	},
	mounted() {
		this.totalRow = this.items.length;
	}
};