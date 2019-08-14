<template>
	<div :style="{height: `${height}px`}"  class="structure-container">
		<p
			v-for="(item, index) in structure"
			class="ms-textTruncate"
			:style="{'padding-left': `${25 * item.level}px`}"
			:title="item.title"
		>
			<span v-if="item.type === 'test'">
				<i
					class="default ms-Icon ms-Icon--UnknownSolid"
					v-show="item.result === 0"></i>
				<i
					class="success ms-Icon ms-Icon--CompletedSolid"
					v-show="item.result === 1"></i>

				<i
					class="fail ms-Icon ms-Icon--ErrorBadge"
					v-show="item.result === -1"></i>
			</span>
			<f-label :size="item.type === 'suit' ? 'lg' : 'sm'" :class="[item.type, 'ms-d-inline-block']">
				<a :href="`#/workbench/project/be67b3cf/source/9665d361/execution/68baf2d8/reporter#`">{{item.title}}</a>
			</f-label>
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
		}
	},
	methods: {
		getHeight() {
			const height = document.body.clientHeight;

			this.height = height - 170;
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

	label.test a {
		font-size: 14px;
		color: #605e5c;
		margin-bottom: 5px;
	}
}
</style>


