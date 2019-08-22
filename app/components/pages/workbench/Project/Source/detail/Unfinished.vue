<template>

</template>

<script>
import mixin from './mixin'

export default {
	data() {
		return {
			filter: {
				progress: '',
				status: []
			}
		}
	},
	mixins: [mixin],
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
				const { progress, status } = this.filter;

				const progressFilter = progress ? execution.progress >= progress : true;
				const statusFilter = status.length ? status.indexOf(execution.status) !== -1 : true;

				return progressFilter && statusFilter;
			});
		}
	}
}
</script>

