<template>
	<f-data-list
		class="custom-list"
		:fields="fields"
		:items="items"
		:select-mode="selectMode"
		v-model="selected"
		@input="select"
		style="overflow: unset;margin-top: 10px"
		/>
</template>

<script>
export default {
	data() {
		return {
			selected: null,
			perPage: 2,
		}
	},
	props: {
		fields: {
			type: Array
		},
		items: {
			type: Array
		},
		value: {
			type: Array
		},
		selectMode: {
			type: String,
			default: null
		}
	},
	watch: {
		value() {
			this.selected = this.value;
		}
	},
	methods: {
		select(result) {
			this.$emit('input', result);
		}
	},
	mounted() {
		this.selected = this.value;
	}
}
</script>

<style lang="scss">
.custom-list {
	.ms-list {
		position: relative;
	}
}
</style>

