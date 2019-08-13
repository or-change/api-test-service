<template>
	<div :style="{height: `${height}px`}"  class="structure-container">
		<p
			v-for="(item, index) in structure"
			:class="[item.type, 'ms-pb-2', 'ms-textTruncate']"
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
			<span>{{item.title}}</span>
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
	}

	p.suit {
		color: #323130;
		font-size: 18px;
		font-weight: 600;
	}

	p.test {
		color: #605e5c;
		font-size: 14px;
	}
}
</style>


