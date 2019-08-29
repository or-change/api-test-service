<template>
	<div v-show="show" class="text-center text-danger">
		<i class="fas fa-exclamation-circle" style="font-size: 16px"></i>
		<label>执行失败</label>
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
