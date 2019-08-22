<template>
	
</template>

<script>
import mixin from './mixin';

export default {
	mixins: [mixin],
	data() {
		return {
			selected: [],
			filter: {
				passRate: ''
			}
		}
	},
	props: {
		items: {
			type: Array,
			default: () => []
		},
		options: {
			type: Array,
			default: () => []
		}
	},
	computed: {
		filteredExecution() {
			return this.items.filter(execution => {
				return this.filter.passRate ? execution.passRate >= this.filter.passRate : true;
			});
		}
	}
}
</script>