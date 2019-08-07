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
	
		<!-- <f-tabs v-model="type" type="link">
			<f-tab-item title="基本配置">
				<f-row class="ms-my-2">
					<f-col col="3">
						<f-text-field
							label="产品名称"
							placeholder="输入产品名称"
							underline
							@focus="resetMessage"
							v-model="production.name" />
					</f-col>
					<f-col col="3" class="ms-ml-3">
						<f-text-field
							label="版本号"
							placeholder="输入版本号"
							underline
							@focus="resetMessage"
							v-model="production.version" />
					</f-col>
					<f-col col="1" class="ms-ml-3">
						<f-button variant="primary" text="更新" @click="updateProduction" />
						<f-label
							style="display: inline-block; vertical-align: baseline"
							:class="[message.state, 'ms-ml-3']">{{ message.content }}</f-label>
					</f-col>
				</f-row>
			</f-tab-item>
			<f-tab-item title="插件配置">
				<f-row class="ms-my-2">
					插件配置
				</f-row>
			</f-tab-item>
		</f-tabs> -->

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
							@focus="resetMessage"
							v-model="production.name" />
					</f-col>
					<f-col col="3" class="ms-ml-3">
						<f-text-field
							label="产品版本号"
							placeholder="输入版本号"
							underline
							@focus="resetMessage"
							v-model="production.version.product" />
					</f-col>
					<f-col col="3" class="ms-ml-3">
						<f-text-field
							label="核心版本号"
							placeholder="输入版本号"
							underline
							@focus="resetMessage"
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
		getProduction() {
			this.$http.product.get()
				.then(res => {
					const { name, version } = res;
					this.production = {
						name, version
					};
				})
		},
		updateProduction() {
			this.$http.admin.version.update(this.production)
				.then(() => {
					this.setMessage('success', '配置更新成功！');
				}).catch(() => {
					this.setMessage('fail', '配置更新失败！');
				})
		}
	},
	mounted() {
		this.getProduction();
	}
}
</script>



<style lang="scss">
#admin-configuration {
	.navigation {
		&.ms-button a, .ms-button button {
			text-align: left;
		}

		&.ms-button-group-vertical .ms-button-no-split .ms-button-dropdown {
			position: relative;
		}
	}
}
</style>

