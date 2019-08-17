<template>
	<div v-show="show" class="ms-center fail">
		<i class="ms-Icon ms-Icon--ErrorBadge" style="font-size: 16px"></i>
		<f-label>执行失败</f-label>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	name: 'create-executor-config',
	data() {
		return {
			show: false
		}
	},
	methods: {
		submit(executionId) {
			return axios.post(`/api/plugin/com.oc.basic/execution/${executionId}/executor`)
				.then(() => {
					this.$emit('success');
				}).catch(e => {
					this.show = true;
					this.$emit('fail');
				})
		}
	}
}
</script>
