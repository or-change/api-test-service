<template>
	
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
	filters: {
		pluginComponent(value, register) {
			return register[value] ? register[value].admin : '';
		},
		pluginName(value, register) {
			return register[value] ? register[value].name : '';
		}
	},
	mounted() {
		this.getProduction();
	}
}
</script>

