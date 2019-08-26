<template>
	<b-modal
		id="upload-source"
		ref="upload-source" size="lg" title="创建项目源代码" centered ok-only
		@ok.prevent="uploadSource" :ok-disabled="!state"
		@hidden="source.semver = '1.0.0'"
		button-size="sm" ok-title="确定"
	>
		<div>
			<label for="source-semver" class="align-middle mb-0">版本号：</label>
			<b-form-input
				id="source-semver" size="sm" class="d-inline-block align-middle mr-3" style="width: 13em"
				v-model="source.semver" :state="state"
			></b-form-input>
			<label for="source-agent" class="align-middle mb-0">方式：</label>
			<b-form-select
				id="source-agent" size="sm" class="d-inline-block align-middle mr-3" style="width: 13em"
				v-model="source.agent" :options="getOptions('source', 'agent')"
			></b-form-select>
			<label for="source-scanner" class="align-middle mb-0">扫描器：</label>
			<b-form-select
				id="source-scanner" size="sm" class="d-inline-block align-middle" style="width: 13em"
				v-model="source.scanner" :options="getOptions('scanner', 'scanner')"
			></b-form-select>
		</div>
		<component
			ref="source-scanner" :is="$product.scanner[source.scanner] ? $product.scanner[source.scanner].create : ''"></component>
		<component
			class="my-3"
			@success="createSuccess"
			ref="upload-agent" :is="$product.source[source.agent] ? $product.source[source.agent].create : ''"></component>
	</b-modal>
</template>

<script>
export default {
	data() {
		return {
			source: {
				semver: '1.0.0',
				agent: '',
				scanner: ''
			}
		}
	},
	props: {
		projectId: {
			type: String
		}
	},
	computed: {
		state() {
			return this.source.semver.length > 0 ? true : false;
		}
	},
	methods: {
		getOptions(type, defaultValue) {
			const options = [];

			for (let key in this.$product[type]) {
				options.push({
					text:	this.$product[type][key].name,
					value: key
				})
			}

			this.source[defaultValue] = options[0] ? options[0].value : '';

			return options;
		},
		async uploadSource() {
			const source = await this.$http.project.source(this.projectId).create(this.source);

			await this.$refs['upload-agent'].submit(source.id);
		},
		async createSuccess() {
			this.$refs['upload-source'].hide();

			this.$emit('success');
		}
	}
}
</script>
