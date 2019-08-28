<template>
	<div class="mt-3">
		<b-breadcrumb
			:items="[
				{
					to: '/',
					html: '<i class=\'fas fa-home\' />'
				},
				{
					to: '/workbench/project',
					text: '我的项目',
					active: true
				}
			]"
		/>

		<div>
			<label for="project-name" class="align-middle mb-0">搜索关键字：</label>
			<b-form-input
				id="project-name" size="sm" class="d-inline-block align-middle mr-3" style="width: 10em"
				v-model="filter.name"
				placeholder="输入查找项目名称"
			></b-form-input>
			<b-button size="sm" variant="primary" v-b-modal.create-project>新建</b-button>
			<b-button size="sm" variant="danger" :disabled="selectedProject.length === 0"
				@click="deleteProject" class="float-right">删除</b-button>
			<b-pagination
				size="sm" class="float-right mr-3 mb-0"
				:total-rows="totalRow" :per-page="perPage"
				v-model="currentPage"
			/>
		</div>

		<custom-table
			ref="projectList" class="mt-3"
			:fields="[
				{ label: '项目名称', key: 'name' },
				{ label: '创建时间', key: 'createdAt', class: 'col-130', sortable: true }
			]"
			:items="projectList"
			:selectable="true"
			sort-by="createdAt" :sort-desc="true"
			:filter="filter.name" :filter-included-fields="['name']"
			:per-page="perPage" :current-page="currentPage"
			@filtered="onFiltered" v-model="selectedProject"
		>
			<template slot="[name]" slot-scope="data">
				<b-link class="text-truncate d-inline-block w-100" :title="data.value"
					:to="`/workbench/project/${data.item.id}`">{{ data.value }}</b-link>
			</template>
			<template slot="[createdAt]" slot-scope="data">
				{{ data.value | dateFormat  }}
			</template>
		</custom-table>

		<b-modal
			id="create-project" size="sm" title="创建新项目" centered ok-only
			button-size="sm" ok-title="创建" @ok.prevent="addProject" @hidden="project.name = 'project 1'"
			:ok-disabled="!state"
		>
			<b-form-group
				label-for="name" label="项目名称" :state="state"
			>
				<b-form-input id="name" v-model="project.name" :state="state" trim></b-form-input>
			</b-form-group>
		</b-modal>
	</div>
</template>

<script>
export default {
	data() {
		return {
			projectList: [],
			selectedProject: [],
			project: {
				name: 'project 1'
			},
			filter: {
				name: null
			},
			currentPage: 1,
			totalRow: 0,
			perPage: 10
		}
	},
	computed: {
		state() {
			return this.project.name.length > 0 ? true : false;
		},
	},
	methods: {
		onFiltered(filteredItems) {
			this.totalRow = filteredItems.length;
      this.currentPage = 1;
		},
		async queryProject() {
			this.projectList = await this.$http.project.query();

			this.totalRow = this.projectList.length;
		},
		async addProject() {
			const project = await this.$http.project.create(this.project);
			this.$router.push(`/workbench/project/${project.id}`);
		},
		async deleteProject() {
			await Promise.all(this.selectedProject.map(id => {
				return this.$http.project.delete(id);
			}));

			await this.queryProject();
			this.selectedProject = [];
		}
	},
	mounted() {
		this.queryProject();
	}
}
</script>



