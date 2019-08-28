<template>
	<b-table
		ref="customTable"
		:fields="computedFields" :items="computedItems" :sort-by="sortBy"
		:sort-desc="sortDesc" :filter="filter" :filter-function="filterFunction"
		:filter-include-fields="filterIncludeFields"
		:per-page="perPage" :current-page="currentPage"
		@filtered="filtered"
		@row-dblclicked="(item) => { $emit('row-dblclicked', item) }"
	>
		<template slot="HEAD[selectable]">
			<b-checkbox :checked="isCheckedAll" 
				:class="{ 'show': isCheckedAll }" :disabled="disabledSelectAll"
				@change="selectAll" />
		</template>
		<template slot="[selectable]" slot-scope="data">
			<b-checkbox :checked="selected.indexOf(data.item.id) !== -1"
				:class="{ 'show': selected.indexOf(data.item.id) !== -1 }"
				@change="selectOne($event, data.item.id)"
				:disabled="!data.value"
			/>
		</template>

		<template v-for="(head, index) in fields" :slot="`HEAD[${head.key}]`" slot-scope="scope">
			<slot :name="`HEAD[${head.key}]`" :value="scope">{{ scope.label }}</slot>
		</template>
		<template v-for="(head, index) in fields" :slot="`[${head.key}]`" slot-scope="scope">
			<slot :name="`[${head.key}]`" :value="scope.value" :item="scope.item">{{ scope.value }}</slot>
		</template>
	</b-table>
</template>

<script>
export default {
	data() {
		return {
			selected: [],
			disabledSelectAll: false,
			isCheckedAll: false
		}
	},
	watch: {
		value() {
			this.selected = this.value;
		},
		items() {
			this.setDisabled();

			if (this.items.length === 0) {
				this.computedCheckedAll();
			}
		},
		selected() {
			this.computedCheckedAll();
		}
	},
	props: {
		value: {
			default: () => []
		},
		selectable: {
			type: Boolean,
			default: false
		},
		fields: {
			type: Array,
			default: []
		},
		items: {
			type: Array,
			default: []
		},
		sortBy: {
			type: String
		},
		sortDesc: {
			type: Boolean,
			default: false
		},
		filter: {
			type: [String, Array, Function, Object]
		},
		filterFunction: {
			type: Function
		},
		filterIncludeFields: {
			type: Array
		},
		perPage: {
			type: Number,
			default: 0
		},
		currentPage: {
			type: Number,
			default: 1
		}
	},
	computed: {
		computedFields() {
			if (this.selectable) {
				return [
					{ label: '', key: 'selectable', class: 'select' },
				].concat(this.fields);
			}

			return this.fields;
		},
		computedItems() {
			return this.items.map(item => {
				if (typeof item.selectable !== 'undefined') {
					return item;
				}

				item.selectable = true;

				return item;
			});
		}
	},
	methods: {
		filtered(filteredItems) {
			this.setDisabled();

			this.$emit('filtered', filteredItems)
		},
		selectAll(checked) {
			if (!checked) {
				this.selected = [];

				this.$emit('input', this.selected);
				return;
			}

			this.selected = this.$refs.customTable.filteredItems
				.filter(item => item.selectable)
				.map(item => item.id);

			this.$emit('input', this.selected);
		},
		selectOne(checked, id) {
			const index = this.selected.indexOf(id);

			if (index === -1) {
				this.selected.push(id);
			} else {
				this.selected.splice(index, 1);
			}

			this.$emit('input', this.selected);
		},
		setDisabled() {
			this.$nextTick(() => {
				this.disabledSelectAll = this.$refs.customTable.filteredItems
					.filter(item => item.selectable).length === 0;
			});
		},
		computedCheckedAll() {
			if (this.$refs.customTable) {
				this.isCheckedAll = this.$refs.customTable.filteredItems
					.filter(item => item.selectable).length === this.selected.length && this.selected.length !== 0;
			}
		}
	}
}
</script>