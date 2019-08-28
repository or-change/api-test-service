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
		<b-button size="sm" variant="primary" :disabled="!state || project.name === projectName" @click="updateProject">更新</b-button>
	</div>
</template>

<script>

export default {
	data() {
		return {
			project: {
				name: ''
			},
			projectName: '',
			error: ''
		}
	},
	props: {
		projectId: {
			default: ''
		}
	},
	computed: {
		state() {
			return this.project.name.length > 0 ? true : false;
		}
	},
	methods: {
		async getProject() {
			this.project = await this.$http.project.get(this.projectId);
			this.projectName = this.project.name;

			this.$emit('inited', this.projectName);
		},
		async updateProject() {
			await this.$http.project.update(this.projectId, {
				name: this.project.name
			});
			
			await this.getProject();
		},
		showError(error) {
			if (error) {
				this.error = error;
				this.$refs['show-error'].show();
			}
		}
	},
	mounted() {
		this.getProject();
	}
}
</script>