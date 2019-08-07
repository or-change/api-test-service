<template>

<div>
	<router-view>Root router view</router-view>
</div>

</template>

<script>
export default {
	
}
</script>

<style lang="scss">
html {
	height: 100%;
}

body {
	height: 100%;
	border-top: 1px solid transparent;
}

.button-danger {
	.ms-button button {
		background-color: #e81123;
		border-color: #e81123;

	}

	.ms-button:hover button {
		background-color: #a80000;
	}
}

.button-group {
	position: absolute;
	right: 0;
	bottom: 0;
}

.col-130 {
	width: 130px !important;
}

.col-100 {
	width: 100px !important;
}
</style>
