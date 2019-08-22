<template>

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


