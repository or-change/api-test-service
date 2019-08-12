<template>
	<div>
		<f-pagination
			class="ms-mt-3 ms-mb-2"
			bar
			v-if="renderItem.length !== 0" :number-of-pages="pageLength" :limit="5" v-model="pageNumber" size="sm" />

		<f-data-list
			class="custom-list"
			:fields="fields"
			:items="renderItem"
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
	</div>
</template>

<script>
export default {
	data() {
		return {
			selected: null,
			pageNumber: 1
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
	computed: {
		pageLength() {
			return Math.ceil(this.items.length / this.perPage) ? Math.ceil(this.items.length / this.perPage) : 1;
		},
		renderItem() {
			return this.items.slice((this.pageNumber - 1) * this.perPage, this.pageNumber * this.perPage + 1);
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

