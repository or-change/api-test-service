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

.button-danger {
	.ms-button button {
		background-color: #e81123;
		border-color: #e81123;

	}

	.ms-button:hover button {
		background-color: #a80000;
	}
}
</style>
