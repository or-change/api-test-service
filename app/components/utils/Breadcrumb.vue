<template>
	<div class="breadcrumb">
		<f-breadcrumb size="lg">
			<f-breadcrumb-item
				href="/"
				split="ms-Icon ms-Icon--ChevronRight"
			>
				<i class="ms-Icon ms-Icon--Home"></i>	
			</f-breadcrumb-item>
			<f-breadcrumb-item
				v-for="(item, index) in items"
				:key="index"
				:href="item.href"
				split="ms-Icon ms-Icon--ChevronRight"
				:active="index === items.length - 1"
				active-class="active"
			>{{ item.text }}</f-breadcrumb-item>
		</f-breadcrumb>
		<hr />
	</div>
</template>

<script>
export default {
	props: {
		items: {
			type: Array
		}
	}
}
</script>


