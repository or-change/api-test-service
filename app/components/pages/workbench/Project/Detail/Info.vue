<template>
	<div>
		<h6 class="font-weight-bold">项目信息</h6>
		<label for="project-name" class="align-middle mb-0">项目名称：</label>
		<b-form-input
			id="project-name" size="sm" class="d-inline-block align-middle mr-3" style="width: 20em"
			v-model="project.name" :state="state"
			placeholder="输入项目名称"
		></b-form-input>
		<label for="project-name" class="align-middle mb-0">创建时间：</label>
		<b-form-input
			id="project-name" size="sm" class="d-inline-block align-middle mr-3" style="width: 10em"
			:value="project.createdAt | dateFormat" readonly
		></b-form-input>
		<b-button size="sm" variant="primary" :disabled="!state || project.name === projectName" @click="$emit('update')">更新</b-button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			project: {
				name: '',
				createdAt: '',
				id: '',
				ownerId: ''
			},
			projectName: '',
			error: ''
		}
	},
	props: {
		value: {
			type: Object
		}
	},
	watch: {
		value() {
			this.project = this.value;
			this.projectName = this.value.name;
		}
	},
	computed: {
		state() {
			this.$emit('input', this.project);

			return this.project.name.length > 0 ? true : false;
		}
	}
}
</script>