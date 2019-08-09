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
					<f-button @click="tab = 0">基本配置</f-button>
					<f-button
						dropdown
						triangle
						size="sm"
						text="插件配置"
						width="auto !important"
					>
						<f-menu slot="menu" style="top: 100%">
							<template slot="menu-body">
								<f-menu-item
									:options="{
										text: '上传插件配置',
										icon: null
									}"
									@actived="tab = 1"
									class="ms-center"
								/>
								<!-- <f-menu-item 
									:options="{
										text: '报告插件配置',
										icon: null
									}"
									@actived="tab = 2"
									class="ms-center"
								/> -->
								<f-menu-item 
									:options="{
										text: '执行器配置',
										icon: null
									}"
									@actived="tab = 3"
									class="ms-center"
								/>
							</template>
						</f-menu>
					</f-button>
				</f-button-group>
			</f-col>
			<f-col col="11" md="10" sm="9" lg="10">
				<div  v-show="tab === 0">
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
						<f-button class="ms-ml-3" variant="primary" text="更新" @click="updateProduction" />
					</f-row>

					<f-row class="ms-mb-2">
						<f-label size="lg" class="ms-my-2">已注册插件</f-label>

						<custom-list
							:fields="fields"
							:items="production.plugins"
						/>
					</f-row>
				</div>

				<div v-show="tab === 1">
					<div class="ms-plugin-container">
						
					</div>
				</div>
				<div v-show="tab === 2">

				</div>
				<div v-show="tab === 3">

				</div>
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
					core: ''
				},
				plugins: []
			},
			executor: [],
			reporter: [],
			source: [],
			fields: [
				{
					label: 'ID',
					key: 'id'
				},
				{
					label: 'Name',
					key: 'name'
				},
				{
					label: 'Version',
					key: 'version'
				},
				{
					label: 'Description',
					key: 'description'
				}
			],
			tab: 0
		}
	},
	methods: {
		async getProduction() {
			const production = await this.$http.product.get();

			this.production = {
				name: production.name, version: production.version,
				plugins: production.plugins
			};

			this.executor = production.executor;
			this.reporter = production.reporter;
			this.source = production.source;
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

