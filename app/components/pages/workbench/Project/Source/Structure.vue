<template>
	<div :style="{height: `${height}px`}"  class="structure-container">
		<p
			v-for="(item, index) in structure"
			class="mb-0 text-truncate"
			:style="{'padding-left': `${25 * item.level}px`}"
			:title="item.title"
		>
			<span v-if="item.type === 'test'">
				<i
					class="text-secondary fas fa-question-circle"
					v-show="item.result === 0"></i>
				<i
					class="text-success fas fa-check-circle"
					v-show="item.result === 1"></i>

				<i
					class="text-danger fas fa-exclamation-circle"
					v-show="item.result === -1"></i>
			</span>
			<label :class="[item.type, 'd-inline-block', 'mb-0']">
				<b-link :to="`/workbench/project/be67b3cf/source/9665d361/execution/68baf2d8/reporter#${item.path}`">{{item.title}}</b-link>
			</label>
		</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			height: '100%',
		}
	},
	props: {
		structure: {
			type: Array,
			default: () => []
		},
		offset: {
			type: Number,
			default: 190
		}
	},
	methods: {
		getHeight() {
			const height = document.body.clientHeight;

			this.height = height - this.offset;
		}
	},
	mounted() {
		this.getHeight();
		
		window.addEventListener('resize', this.getHeight);
	},
	destroyed() {
		window.removeEventListener('resize', this.getHeight);
	}
}
</script>

<style lang="scss">
.structure-container {
	overflow: auto;

	p {
		position: relative;

		i {
			vertical-align: middle;
		}
	}

	label a {
		color: #323130;
	}

	label.suit a {
		font-size: 16px;
		font-weight: 600;
	}

	label.test a {
		font-size: 14px;
		color: #605e5c;
		margin-bottom: 5px;
	}
}
</style>