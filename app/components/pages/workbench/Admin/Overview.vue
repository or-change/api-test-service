<template>
	<div class="mt-3">
		<b-breadcrumb
			:items="[
				{
					to: '/',
					html: '<i class=\'fas fa-home\' />'
				},
				{
					to: '/workbench/admin/configuration',
					text: '管理员平台'
				},
				{
					to: '/workbench/admin/overview',
					text: '概览',
					active: true
				}
			]"
		/>
	</div>
</template>
