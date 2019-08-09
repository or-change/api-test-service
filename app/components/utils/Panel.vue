<template>
	<div class="ms-my-2 ms-p-5 panel">
		<slot></slot>
	</div>
</template>

<style lang="scss">
.panel {
	background-color: #edebe9;
	border-radius: 5px;
	border: 1px solid transparent;
	min-height: 400px;
	color: #323130;

	h1, h2 {
		font-weight: 300;
		line-height: 1.2;
	}

	hr {
		opacity: 0.5;
	}
}
</style>

