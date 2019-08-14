<template>
	<div
		id="project-detail"
	>
		<custom-breadcrumb
			:items="[
				{
					text: '我的项目',
					href: '#/workbench/project'
				},
				{
					text: project ? projectName : `项目: ${projectId}`,
					href: `#/workbench/project/${projectId}`
				}
			]"
			/>

		<f-row>
			<f-col col="9">
				<f-label size="lg" class="ms-mb-2">项目源代码列表</f-label>
				<f-row class="ms-mb-2" style="position: relative">
					<div class="button-group">
						<f-button
							class="button-danger"
							text="删除"
							variant="primary"
							:disabled="!selectedSourceList || selectedSourceList.length === 0"
							@click="deleteSource"
						/>
					</div>
					<f-col col="2" sm="4" md="4" lg="2">
						<f-dropdown
							:options="semverList"
							placeholder="选择源代码版本"
							v-model="filter.semver"
							multi-select
						/>
					</f-col>
					<f-col col="2" sm="4" md="4" lg="2" class="ms-ml-2">
						<f-dropdown
							:options="sourceAgentOptions"
							placeholder="选择agent类型"
							v-model="filter.agent"
							multi-select
						/>
					</f-col>
					<f-col col="2" sm="4" md="4" lg="2" class="ms-ml-2">
						<f-dropdown
							:options="status"
							placeholder="选择初始化状态"
							v-model="filter.status"
							multi-select
						/>
					</f-col>
					<f-button 
						text="创建源代码"
						variant="primary"
						@click="show = true"
						class="ms-ml-3"
					/>
				</f-row>

				<custom-list
						:fields="fields"
						:items="filteredSourceList"
						:select-mode="filteredSourceList.length !== 0 ? 'multi' : 'single'"
						v-model="selectedSourceList"
						@input="changeSelected"
				>
					<template slot="row-semver" slot-scope="props">
						<f-link
							:class="{
								'link-disabled': props.value.status !== 5
							}"
							:href="props.value.status === 5 ? 
								`#/workbench/project/${projectId}/source/${props.value.id}`
								: undefined"
						>{{props.value.semver}}</f-link>
					</template>

					<template slot="row-initialized" slot-scope="props">
						<i
							class="success ms-Icon ms-Icon--CompletedSolid"
							v-show="props.value.initialized"></i>
						<i
							class="fail ms-Icon ms-Icon--ErrorBadge"
							v-show="!props.value.initialized"></i>
					</template>

					<template slot="row-agent" slot-scope="props">
						{{ props.value.agent | agentFormat($product) }}
					</template>

					<template slot="row-status" slot-scope="props">
						{{ props.value.status | statusFormat }}
					</template>

					<template slot="row-error" slot-scope="props">
						<f-button
							@click="showError(props.value.error)"
							:border="false"
							:icon="props.value | statusIcon"
							style="line-height: 34px"
							class="toggle-dialog"
						/>
					</template>

					<template slot="row-download" slot-scope="props">
						<f-link
							:class="{
								'link-disabled': !props.value.initialized
							}"
							:href="`/api/project/${projectId}/source/${props.value.id}/pack`"
						>
							<i class="ms-Icon ms-Icon--CloudDownload"></i>
						</f-link>
					</template>
					<template slot="row-createdAt" slot-scope="props">
						{{ props.value.createdAt | dateFormat }}
					</template>
				</custom-list>
			</f-col>
			<f-col col="3" class="ms-pl-3">
				<f-label size="lg" class="ms-mb-2">项目信息</f-label>
				<f-text-field
					label="项目名称"
					placeholder="输入项目名称"
					underline
					v-model="project.name" />
				<f-text-field
					class="ms-mt-3"
					label="创建时间"
					underline
					readonly
					:value="project.createdAt | dateFormat" />
				<f-button
					class="ms-mt-3"
					text="更新"
					variant="primary"
					@click="updateProject"
				/>
			</f-col>
		</f-row>
		<custom-dialog
			id="create-source"
			v-model="show" 
			title="创建项目源代码"
			ok-text="确定"
			@ok="uploadSource"
			size="md"
			:cancelButton="false"
		>
			<f-row class="ms-mb-2">
				<f-col col="5">
					<f-text-field
						label="版本号"
						underline
						v-model="source.semver"
					/>
				</f-col>
				<f-col col="6" class="ms-ml-2">
					<div class="dropdown-container">
						<f-label class="ms-d-inline-block ms-p-0 label-dropdown">创建方式</f-label>
						<f-dropdown
							class="ms-d-inline-block"
							:options="sourceAgentOptions"
							placeholder="选择方式"
							v-model="source.agent"
							style="width: 92px;"
						/>
					</div>
				</f-col>
			</f-row>

			<component
				@fail=""
				@success="createSuccess"
				ref="upload-source" :is="sourceAgent"></component>
		</custom-dialog>

		<custom-dialog
			id="show-error"
			v-model="error.show" 
			title="错误信息"
			ok-text="确定"
			@ok="error.show = false"
			:cancelButton="false"
		>
			<textarea rows="10" readonly :value="error.msg" style="width: 100%"></textarea>
		</custom-dialog>
	</div>
</template>

<script>
const STATUS = {
	'0': '正在配置',
	'1': '配置完毕',
	'2': '正在解压',
	'3': '下载依赖',
	'4': '正在扫描',
	'5': '结束'
};

export default {
	data() {
		return {
			project: {
				name: ''
			},
			projectName: '',
			sourceList: [],
			source: {
				semver: '1.0.0',
				agent: ''
			},
			selectedSourceList: [],
			show: false,
			error: {
				show: false,
				msg: ''
			},
			filter: {
				semver: [],
				agent: [],
				status: []
			},
			fields: [
				{
					label: 'Semver',
					key: 'semver'
				},
				{
					label: 'Status',
					key: 'status'
				},
				{
					label: 'Error',
					key: 'error'
				},
				{
					label: 'Agent',
					key: 'agent'
				},
				{
					label: 'CreatedAt',
					key: 'createdAt'
				},
				{
					label: '',
					key: 'download'
				}
			]
		}
	},
	watch:{
		show() {
			if (!this.show) {
				this.source.semver = '1.0.0';
			}
		}
	},
	filters: {
		agentFormat(value, product) {
			return product.source[value] ? product.source[value].name : value; 
		},
		statusFormat(value) {
			return STATUS[value];
		},
		statusIcon(value) {
			if (value.error) {
				return 'fail ms-Icon ms-Icon--StatusErrorFull';
			}

			if (value.status < 5) {
				return 'default ms-Icon ms-Icon--UnknownSolid';
			}

			if (value.status === 5) {
				return 'success ms-Icon ms-Icon--CompletedSolid';
			}
		}
	},
	computed: {
		projectId() {
			return this.$route.params.projectId;
		},
		filteredSourceList() {
			return this.sourceList.filter((source) => {
				const { semver, status, agent } = this.filter;

				const semverFilter = semver.length ? semver.indexOf(source.semver) !== -1 : true;
				const agentFilter = agent.length ? agent.indexOf(source.agent) !== -1 : true;
				const statusFilter = status.length ? status.indexOf(source.status) !== -1 : true;

				return semverFilter && statusFilter && agentFilter;
			}).sort((a, b) => {
				return b.createdAt - a.createdAt;
			});
		},
		semverList() {
			const semverList = [];
			const result = [];

			this.sourceList.map(source =>  {
				return source.semver;
			}).forEach((semver) => {
				if (semverList.indexOf(semver) === -1) {
					semverList.push(semver);
					result.push({text: semver, value: semver});
				}
			});

			return result;
		},
		sourceAgentOptions() {
			const sourceAgent = [];
			const { source } = this.$product;

			for (let key in source) {
				sourceAgent.push({
					text:	source[key].name,
					value: key
				})
			}

			this.source.agent = sourceAgent[0] ? sourceAgent[0].value : '';

			return sourceAgent;
		},
		sourceAgent() {
			const { source } = this.$product;

			if (source[this.source.agent]) {
				return source[this.source.agent].create;
			}

			return '';
		},
		status() {
			const statusValue = Object.keys(STATUS);

			return statusValue.map(status => {
				return {
					value: Number(status),
					text: STATUS[status]
				};
			});
		}
	},
	methods: {
		async getProject() {
			this.project = await this.$http.project.get(this.projectId);
			this.projectName = this.project.name;
		},
		async updateProject() {
			await this.$http.project.update(this.projectId, {
				name: this.project.name
			});
			
			await this.getProject();
		},
		async uploadSource() {
			const source = await this.$http.project.source(this.projectId).create(this.source);

			await this.$refs['upload-source'].submit(source.id);
		},
		async deleteSource() {
			await Promise.all(this.selectedSourceList.map(source => {
				return this.$http.project.source(this.projectId).delete(source.id);
			}));

			await this.getSourceList();
			this.selectedSourceList = [];
		},
		async getSourceList() {
			this.sourceList = await this.$http.project.source(this.projectId).query();
		},
		async createSuccess() {
			this.show = false;
			
			await	this.getSourceList();
		},
		showError(error) {
			if (error) {
				this.error.show = true;
				this.error.msg = error;
			}
		},
		changeSelected() {
			const { status, error } = this.selectedSourceList[this.selectedSourceList.length - 1];

			if (status !== 5 && !error) {
				this.selectedSourceList.pop();
			}
		}
	},
	mounted() {
		this.getProject();
		this.getSourceList();
	}
}
</script>

<style lang="scss">
.ms-link.link-disabled {
	text-decoration: none;
	cursor: default;
	color: #a19f9d;

	&:hover {
		text-decoration: none;
		color: #a19f9d;
	}
}

.toggle-dialog {
	.ms-button {
		background-color: transparent;
	}
}

#show-error .ms-modal-main{
	max-width: 1024px;
}
</style>
