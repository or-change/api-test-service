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
					to: '/workbench/admin/configuration',
					text: '配置',
					active: true
				}
			]"
		/>
		<b-tabs pills small vertical>
      <b-tab title="基本配置" active>
				<div>
					<label for="project-name" class="align-middle mb-0">产品名称：</label>
					<b-form-input
						id="project-name" size="sm" class="d-inline-block align-middle mr-3" style="width: 20em"
						v-model="production.name"
						placeholder="输入产品名称"
					></b-form-input>
					<label for="project-name" class="align-middle mb-0">产品版本号：</label>
					<b-form-input
						id="project-name" size="sm" class="d-inline-block align-middle mr-3" style="width: 8em"
						v-model="production.version.product"
						placeholder="输入版本号"
					></b-form-input>
					<label for="project-name" class="align-middle mb-0">核心版本号：</label>
					<b-form-input
						id="project-name" size="sm" class="d-inline-block align-middle mr-3" style="width: 8em"
						v-model="production.version.core"
						placeholder="输入版本号"
					></b-form-input>
					<b-button size="sm" variant="primary" @click="updateProduction">更新</b-button>
				</div>
				<h6 class="my-4 font-weight-bold">已注册插件</h6>
				<b-pagination
					size="sm"
					:total-rows="totalRow" :per-page="perPage"
					v-model="currentPage"
				/>

				<b-table
					:fields="[
						{ label: '标识', key: 'id' },
						{ label: '名称', key: 'name' },
						{ label: '版本号', key: 'version' },
						{ label: '描述', 	key: 'description' }
					]"
					:items="production.plugins"
				/>
			</b-tab>
      <!-- <b-tab title="上传插件配置">
				<div class="mb-4 px-4 py-2" v-for="(sourceAgent, index) in source"
					:key="index"
				>
					<h6 class="my-4 font-weight-bold">{{ sourceAgent | pluginName($product.source) }}</h6>
					<component :is="sourceAgent | pluginComponent($product.source)" />
				</div>	
			</b-tab> -->

      <!-- <b-tab title="执行器配置">
				<div class="mb-4 px-4 py-2" v-for="(executorRetrive, index) in source"
					:key="index"
				>
					<h6 class="my-4 font-weight-bold">{{ executorRetrive | pluginName($product.source) }}</h6>
					<component :is="executorRetrive | pluginComponent($product.source)" />
				</div>	
			</b-tab> -->
    </b-tabs>
	</div>
</template>

<script>
export default {
	data() {
		return {
			production: {
				name: '',
				version: {
					product: '',
					core: ''
				},
				plugins: []
			},
			totalRow: 0,
			perPage: 10,
			currentPage: 1,
			executor: [],
			reporter: [],
			source: []
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
	filters: {
		pluginComponent(value, register) {
			return register[value] ? register[value].admin : '';
		},
		pluginName(value, register) {
			return register[value] ? register[value].name : '';
		}
	},
	mounted() {
		this.getProduction().then(() => {
			this.totalRow = this.production.plugins.length;
		});
	}
}
</script>

