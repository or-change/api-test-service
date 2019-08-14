<template>

	<div>
		<custom-breadcrumb
			:items="[
				{
					text: '管理员平台',
					href: '#/workbench/admin/configuration'
				},
				{
					text: '项目管理',
					href: '#/workbench/admin/project'
				}
			]"
			/>
		
		<f-row class="ms-my-3" style="position: relative">
			<div class="button-group">
				<f-button 
					text="更改项目所有者"
					variant="primary"
					@click="show = true"
				/>
			</div>
			<f-col col="2" sm="4" md="4" lg="2">
				<f-text-field
					label="项目名称"
					placeholder="输入查找项目名称"
					v-model="filter.name" />
			</f-col>
			<f-col col="2" sm="4" md="4" lg="2" class="ms-ml-5">
				<f-label>项目负责人</f-label>
				<f-dropdown
					:options="ownerList"
					placeholder="选择项目负责人"
					v-model="filter.owner"
					multi-select
				/>
			</f-col>
		</f-row>

		<custom-list
			:fields="[
				{ label: '项目名称', key: 'name' },
				{ label: '所有者', key: 'owner' },
				{ label: '创建时间', key: 'createdAt' }
			]"
			:items="filteredProjectList"
			:select-mode="filteredProjectList.length !== 0 ? 'multi' : 'single'"
			v-model="selectedProject"
		>
			<template slot="row-createdAt" slot-scope="props">
				{{ props.value.createdAt | dateFormat }}
			</template>
		</custom-list>

		<custom-dialog
			id="project-assign"
			v-model="show" 
			title="更换项目所有者"
			ok-text="确定"
			@ok="assignOwner"
		>
			<f-dropdown
				:options="ownerList"
				placeholder="选择项目负责人"
				v-model="selectOwner"
			/>
		</custom-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			projectList: [],
			show: false,
			selectOwner: null,
			accountList: [],
			selectedProject: [],
			filter: {
				name: null,
				owner: []
			}
		}
	},
	computed: {
		ownerList() {
			return this.accountList.map(account => {
				return {
					text: account.name,
					value: account.id
				};
			})
		},
		filteredProjectList() {
			return this.projectList.map(project => {
				const account = this.accountList.find(account => account.id === project.ownerId);

				if (account) {
					project.owner = account.name;
				}

				return project;
			}).filter((project) => {
				const { name, owner } = this.filter;

				const nameFilter = name ? new RegExp(name).test(project.name) : true;
				const ownerFilter = owner.length ? owner.indexOf(project.ownerId) !== -1 : true;

				return nameFilter && ownerFilter;
			}).sort((a, b) => {
				return new Date(b.createdAt) - new Date(a.createdAt);
			});
		}
	},
	watch: {
		show() {
			if (!this.show) {
				this.selectOwner = null;
			}
		}
	},
	methods: {
		async queryProject() {
			this.projectList = await this.$http.admin.project.query();
		},
		async assignOwner() {
			if (this.selectedProject.length === 0 || this.selectOwner === null) {
				this.show = false;
			}

			await Promise.all(this.selectedProject
				.map(project => this.$http.admin.project.assign(project.id, this.selectOwner)));

			this.show = false;
			await this.queryProject();
		},
		async getAccountList() {
			this.accountList = await this.$http.account.query();
		}
	},
	mounted() {
		this.queryProject();
		this.getAccountList();
	}
}
</script>


