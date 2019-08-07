<template>
	<f-data-list
		class="custom-list"
		:fields="fields"
		:items="items"
		:select-mode="selectMode"
		:resizeabled="false"
		v-model="selected"
		@input="select"
	>	
		<template
			v-for="(field, index) in fields"
			:slot="`row-${field.key}`"
			slot-scope="props"
		>
			<slot
				:name="`row-${field.key}`"
				:value="props.value"
			></slot>
    </template>
	</f-data-list>
</template>

<script>
export default {
	data() {
		return {
			selected: null
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
		},
		perPage: {
			type: Number,
			default: 10
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

