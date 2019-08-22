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
				status: []
			}
		}
	},
	props: {
		items: {
			type: Array,
			default: () => []
		}
	},
	computed: {
		filteredExecution() {
			return this.items.filter(execution => {
				return this.filter.status.length ? this.filter.status.indexOf(execution.status) !== -1 : true;
			});
		}
	}
}
</script>

