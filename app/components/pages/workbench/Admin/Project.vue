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
			:fields="fields"
			:items="filteredProjectList"
			:select-mode="filteredProjectList.length !== 0 ? 'multi' : 'single'"
			v-model="selectedProject"
		/>

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
			<f-label
				v-show="fail"
				style="color: red"
				class="ms-pt-3"
			>
				更换失败！
			</f-label>
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
			fail: false,
			accountList: [],
			selectedProject: [],
			fields: [
				{
					label: 'Name',
					key: 'name'
				},
				{
					label: 'Owner',
					key: 'owner'
				},
				{
					label: 'createdAt',
					key: 'createdAt'
				}
			],
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
			let filteredProject = this.projectList;

			
			if (this.filter.name) {
				const nameReg = new RegExp(this.filter.name);

				filteredProject = filteredProject
					.filter(project => nameReg.test(project.name));

			}
				
			if (this.filter.owner && this.filter.owner.length !== 0) {
				filteredProject = filteredProject
					.filter(project => this.filter.owner.indexOf(project.owner.id) !== -1);
			}
			
			return filteredProject.map(project => {
				return {
					id: project.id,
					name: project.name,
					owner: project.owner.name,
					createdAt: project.createdAt
				};
			}).sort((a, b) => {
				return new Date(b.createdAt) - new Date(a.createdAt);
			});
		}
	},
	watch: {
		show() {
			if (!this.show) {
				this.fail = false;
				this.selectOwner = null;
			}
		}
	},
	methods: {
		getProject() {
			this.$http.admin.project.query().then((res) => {
				this.projectList = res.data;
			})
		},
		assignOwner() {
			this.fail = false;

			if (this.selectedProject.length === 0 || this.selectOwner === null) {
				this.show = false;
			}

			Promise.all(this.selectedProject
				.map(project => this.$http.admin.project.assign(project.id, this.selectOwner)))
				.then(() => {
					this.show = false;
					this.getProject();
				}).catch(() => {
					this.fail = true;
				})
		},
		getAccountList() {
			this.$http.account.query().then((res) => {
				this.accountList = res.data;
			});
		}
	},
	mounted() {
		this.getProject();
		this.getAccountList();
	}
}
</script>

<style lang="scss">
.button-group {
	position: absolute;
	right: 0;
	bottom: 0;
}
</style>



