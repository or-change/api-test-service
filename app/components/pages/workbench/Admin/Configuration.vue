<template>
	<div id="admin-configuration">
		<custom-breadcrumb
			:items="[
				{
					text: '管理员平台',
					href: '#/workbench/admin/configuration'
				},
				{
					text: '配置',
					href: '#/workbench/admin/configuration'
				}
			]"
		/>

		<f-row>
			<f-col col="1" md="2" sm="3" lg="2">
				<f-button-group vertical :border="false" class="navigation">
					<f-button>基本配置</f-button>
					<f-button
						dropdown
						triangle
						size="sm"
						text="插件配置"
						width="auto !important"
					>
						<f-menu slot="menu"></f-menu>
					</f-button>
				</f-button-group>
			</f-col>
			<f-col col="11" md="10" sm="9" lg="10">
				<f-row class="ms-mb-2">
					<f-col col="3">
						<f-text-field
							label="产品名称"
							placeholder="输入产品名称"
							underline
							v-model="production.name" />
					</f-col>
					<f-col col="3" class="ms-ml-3">
						<f-text-field
							label="产品版本号"
							placeholder="输入版本号"
							underline
							v-model="production.version.product" />
					</f-col>
					<f-col col="3" class="ms-ml-3">
						<f-text-field
							label="核心版本号"
							placeholder="输入版本号"
							underline
							v-model="production.version.core" />
					</f-col>
				</f-row>
				<f-button variant="primary" text="更新" @click="updateProduction" />
				<f-label
					style="display: inline-block; vertical-align: baseline"
					:class="[message.state, 'ms-ml-3']">{{ message.content }}</f-label>

				<f-row class="ms-mb-2">
					<f-label size="lg" class="ms-my-2">已注册插件</f-label>
				</f-row>
			</f-col>
		</f-row>
	</div>
</template>

<script>
export default {
	data() {
		return {
			type: 0,
			production: {
				name: '',
				version: {
					product: '',
					core: '',
					plugins: null
				}
			}
		}
	},
	methods: {
		async getProduction() {
			this.production = this.$http.product.get();
		},
		async updateProduction() {
			await this.$http.admin.version.update(this.production);

			this.getProduction();
		}
	},
	mounted() {
		this.getProduction();
	}
}
</script>

