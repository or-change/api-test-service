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
					to: '/workbench/admin/project',
					text: '项目列表',
					active: true
				}
			]"
		/>

		<div>
			<label for="project-name" class="align-middle mb-0">搜索关键字：</label>
			<b-form-input
				id="project-name" size="sm" class="d-inline-block align-middle mr-3" style="width: 10em"
				v-model="keyword"
				placeholder="输入查找项目名称"
			></b-form-input>
			<b-button variant="primary" size="sm" v-b-modal.assign-owner>
				更改项目所有者
			</b-button>
			<b-pagination
				size="sm" class="float-right mr-3 mb-0"
				:total-rows="totalRow" :per-page="perPage"
				v-model="currentPage"
			/>
		</div>

		<b-table
			ref="projectList" class="mt-3"
			:fields="[
				{ label: '', key: 'select', class: 'select' },
				{ label: '项目名称', key: 'name' },
				{ label: '所有者', key: 'ownerId' },
				{ label: '创建时间', key: 'createdAt', sortable: true }
			]"
			:items="projectList"
			sort-by="createdAt" :sort-desc="true"
			:filter="keyword" :filter-function="filter"
			:per-page="perPage" :current-page="currentPage"
			@filtered="onFiltered"
		>
			<template slot="HEAD[select]">
				<b-checkbox :checked="totalRow && totalRow === selectedProject.length" 
					:class="{ 'show': totalRow && totalRow === selectedProject.length }"
					@change="selectAll" />
			</template>
			<template slot="[select]" slot-scope="data">
				<b-checkbox :checked="selectedProject.indexOf(data.item.id) !== -1"
					:class="{ 'show': selectedProject.indexOf(data.item.id) !== -1 }"
					@change="selectOne($event, data.item.id)" />
			</template>

			<template slot="[createdAt]" slot-scope="data">
				{{ data.value | dateFormat }}
			</template>
		</b-table>

		<b-modal
			id="assign-owner" size="sm" title="更换项目所有者" centered
			button-size="sm" ok-title="确定" cancel-title="取消"
			@ok="assignOwner" @hidden="selectOwner = null"
		>
			<b-form-select v-model="selectOwner" :options="ownerList" size="sm" />
		</b-modal>
	</div>
</template>

<script>
export default {
	data() {
		return {
			projectList: [],
			selectOwner: null,
			accountList: [],
			selectedProject: [],
			keyword: '',
			currentPage: 1,
			totalRow: 0,
			perPage: 10
		}
	},
	filters: {
		ownerFormat(value) {
			this.accountList.find(account => value === account.id).name;
		}
	},
	computed: {
		ownerList() {
			return [
				{
					text: '选择新的负责人',
					value: null
				}
			].concat(this.accountList.map(account => {
				return {
					text: account.name,
					value: account.id
				};
			}));
		}
	},
	methods: {
		selectAll(checked) {
			if (!checked) {
				return this.selectedProject = [];
			}
			return this.selectedProject = this.$refs.projectList.filteredItems.map(project => project.id);
		},
		selectOne(checked, id) {
			const index = this.selectedProject.indexOf(id);

			if (index === -1) {
				return this.selectedProject.push(id);
			}
			return this.selectedProject.splice(index, 1);
		},
		onFiltered(filteredItems) {
			this.totalRow = filteredItems.length;
      this.currentPage = 1;
		},
		filter(item, keyword) {
			const regExp = new RegExp(keyword);

			return regExp.test(item.name)
				|| regExp.test(this.$options.filters.ownerFormat(item.ownerId));
		},
		async queryProject() {
			this.projectList = await this.$http.admin.project.query();
		},
		async assignOwner() {
			if (this.selectedProject.length === 0 || this.selectOwner === null) {
				return;
			}

			await Promise.all(this.selectedProject
				.map(project => this.$http.admin.project.assign(project.id, this.selectOwner)));
			await this.queryProject();
		},
		async getAccountList() {
			this.accountList = await this.$http.account.query();
		}
	},
	mounted() {
		this.queryProject().then(() => {
			this.totalRow = this.projectList.length;
		});
		this.getAccountList();
	}
}
</script>


