<template>

	<div>
		<custom-breadcrumb
			:items="[
				{
					text: '我的项目',
					href: '#/workbench/project'
				},
				{
					text: projectName ? projectName : projectId,
					href: `#/workbench/project/${projectId}`
				},
				{
					text: '源代码',
					href: `#/workbench/project/${projectId}`
				},
				{
					text: source.semver,
					href: `#/workbench/project/${projectId}/source/${sourceId}`
				}
			]"
			/>

		<f-row>
			<f-col col="7">
				<f-label size="lg" class="ms-mb-2">执行列表</f-label>
				<f-row style="position: relative" class="ms-mb-4">
					<f-col col="2">
						<f-datepicker v-model="filter.startAt" label="开始时间" overlaid size="sm" />
					</f-col>
					<f-col col="2" class="ms-ml-3">
						<f-label>进度</f-label>
						<f-dropdown
							:options="[
								{
									text: '10%',
									value: '10'
								},
								{
									text: '20%',
									value: '20'
								},
								{
									text: '30%',
									value: '30'
								},
								{
									text: '40%',
									value: '40'
								},
								{
									text: '50%',
									value: '50'
								},
								{
									text: '60%',
									value: '60'
								},
								{
									text: '70%',
									value: '70'
								},
								{
									text: '80%',
									value: '80'
								},
								{
									text: '90%',
									value: '90'
								},
								{
									text: '100%',
									value: '1'
								}
							]"
							placeholder="选择执行进度"
							v-model="filter.progress"
						/>
					</f-col>
					<div class="button-group">
						<f-button 
							text="执行"
							variant="primary"
							@click="startExecution"
						/>

						<f-button
							class="button-danger"
							text="删除"
							variant="primary"
							:disabled="selectedExecutionList.length === 0"
							@click="deleteExecution"
						/>
					</div>
				</f-row>
				<custom-list
					:fields="field"
					:items="filteredExecutionList"
					:select-mode="filteredExecutionList.length !== 0 ? 'multi' : 'single'"
					v-model="selectedExecutionList"
				>
					<template slot="row-progress" slot-scope="item">
						<f-row>
							<f-col col="10">
								<f-progress
									:data="{
										value: item.value.progress,
										variant: 'success'
									}" size="lg"
									style="margin: 20px 0;"
								/>
							</f-col>
							<f-col col="2">
								{{`${item.value.progress}%`}}
							</f-col>
						</f-row>
					</template>

				</custom-list>
			</f-col>
			<f-col col="5" class="ms-pl-3">
				<f-label size="lg" class="ms-mb-2">源码摘要: 版本{{ source.semver }}</f-label>
				<p v-for="(item, index) in abstract"
					:style="{'padding-left': `${50 * item.level}px`}"
				>

					<!-- type 和状态 -->
					{{item.title}}
				</p>
			</f-col>
		</f-row>
	</div>
</template>

<script>
function constructList(tree, result = [], level = 0) {
	tree.children.forEach(node => {
		result.push({
			level,
			only: node.only,
			skip: node.skip,
			title: node.title,
			type: node.type
		});

		if (node.children) {
			const newLevel = level + 1;

			constructList(node, result, newLevel);
		}
	});

	return result;
}

export default {
	data() {
		return {
			sourcePlugin: null,
			executionPlugin: null,
			source: {
				semver: '',
				createdAt: '',
				execution: null,
				structure: null
			},
			projectName: null,
			executionList: [],
			selectedExecutionList: [],
			field: [
				{
					label: 'ID',
					key: 'hash',
					class: 'ms-w-auto'
				},
				{
					label: 'StartAt',
					key: 'startAt',
					class: 'ms-w-auto'
				},
				{
					label: 'EndAt',
					key: 'endAt',
					class: 'ms-w-auto'
				},
				{
					label: 'Progress',
					key: 'progress'
				}
			],
			filter: {
				startAt: null,
				progress: ''
			}
		}
	},
	computed: {
		sourceId() {
			return this.$route.params.sourceId;
		},
		projectId() {
			return this.$route.params.projectId;
		},
		abstract() {
			if (this.source.structure) {
				return constructList(this.source.structure);
			}

			return [];
		},
		filteredExecutionList() {
			let filteredExecutionList = this.executionList.map((execution) => {
				const { hash, startAt, endAt, state } = execution;

				return {
					hash, startAt, endAt, progress: (state.ended / state.length) * 100
				};
			});

			if (this.filter.startAt) {
				filteredExecutionList = filteredExecutionList
					.filter(execution => new Date(execution.startAt).getTime() >= new Date(this.filter.startAt).getTime())
			}

			if (this.filter.progress !== '') {
				filteredExecutionList = filteredExecutionList
					.filter(execution => execution.progress >= Number(this.filter.progress));
			}

			return filteredExecutionList;
		}
	},
	methods: {
		getProject() {
			this.$http.project.get(this.projectId)
				.then(res => {
					this.projectName = res.data.name;
				})
		},
		getSource() {
			this.sourcePlugin.get(this.sourceId)
				.then(res => {
					this.source = res.data;
				});
		},
		getExecutionList() {
			this.executionPlugin.query().then((res) => {
				this.executionList = res.data;
			});
		},
		startExecution() {
			this.executionPlugin.start({}).then(() => {
				this.getExecutionList();
			}).catch(() => {
				// TODO 执行失败
			});
		},
		deleteExecution() {
			return Promise.all(this.selectedExecutionList.map(execution => {
				return this.executionPlugin.delete(execution.hash);
			})).then(() => {
				this.getExecutionList();
			}).catch(() => {
				// TODO 删除失败
			});
		}	
	},
	mounted() {
		this.sourcePlugin = this.$http.project.source(this.projectId);
		this.executionPlugin = this.sourcePlugin.execution(this.sourceId);

		this.getSource();
		this.getExecutionList();
	}
}
</script>

<style lang="scss">
.border-right {
	border-right: 1px solid #323130;
}
#execution-container {
	border: 1px solid #323130;
	.ms-col {
		min-height: 500px;
	}
}
</style>


