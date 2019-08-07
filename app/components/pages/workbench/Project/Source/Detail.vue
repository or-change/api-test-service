<template>
	<div id="execution-container">
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
			<f-col col="8">
				<f-label size="lg" class="ms-mb-2">执行列表</f-label>

				<f-row style="position: relative" class="ms-mb-2">
					<f-col col="2">
						<f-datepicker v-model="filter.startAt" label="开始时间" overlaid size="sm" />
					</f-col>
					<f-button 
						text="执行"
						variant="primary"
						@click="startExecution"
						style="margin-top: 18px;"
						class="ms-ml-3"
					/>
				</f-row>

				<f-tabs v-model="type" type="link">
					<f-tab-item title="执行完成">
						<f-row style="position: relative" class="ms-my-2">
							<f-col col="2">
								<f-label>通过率</f-label>
								<f-dropdown
									:options="options"
									placeholder="选择执行通过率"
									v-model="completed.filter.passRate"
								/>
							</f-col>
							<div class="button-group">
								<f-label
									:class="[
										'ms-mt-1',
										'ms-ml-3',
										message.state
									]"
									style="display: inline-block; vertical-align: baseline"
								>
									{{ message.content }}
								</f-label>
								<f-button
									class="button-danger"
									text="删除"
									variant="primary"
									:disabled="completed.selected.length === 0"
									@click="deleteExecution"
								/>
							</div>
						</f-row>

						<custom-list
							:fields="completed.field"
							:items="filteredCompleted"
							:select-mode="filteredCompleted.length !== 0 ? 'multi' : 'single'"
							v-model="completed.selected"
						>
							<template slot="row-passRate" slot-scope="item">
								<f-row>
									<f-col col="9">
										<f-progress
											:data="{
												value: item.value.passRate,
												variant: 'primary'
											}" size="lg"
											style="margin: 20px 0;"
										/>
									</f-col>
									<f-col col="3">
										{{`${item.value.passRate}%`}}
									</f-col>
								</f-row>
							</template>

							<template slot="row-reporter" slot-scope="item">
								<f-button
									id="search-reporter-online"
									size="lg" tag="a"
									:border="false"
									icon="ms-Icon ms-Icon--CRMReport"
									:href="`#/workbench/project/${projectId}/source/${sourceId}/execution/${item.value.hash}/reporter`"
									title="查看在线报告"
								/>
							</template>

							<template slot="row-download" slot-scope="item">
								<f-button
									size="lg"
									:border="false"
									icon="ms-Icon ms-Icon--DownloadDocument"
									@click="show = true; completed.downloadExecutionId = item.value.hash"
									title="下载测试报告"
								/>
							</template>
						</custom-list>
					</f-tab-item>
					<f-tab-item title="未执行完成">
						<f-row style="position: relative" class="ms-my-2">
							<f-col col="2">
								<f-label>进度</f-label>
								<f-dropdown
									:options="options"
									placeholder="选择执行进度"
									v-model="unfinished.filter.progress"
								/>
							</f-col>
						</f-row>

						<custom-list
							:fields="unfinished.field"
							:items="filteredUnfinished"
						>
							<template slot="row-progress" slot-scope="item">
								<f-row>
									<f-col col="9">
										<f-progress
											:data="{
												value: item.value.progress,
												variant: 'success'
											}" size="lg"
											style="margin: 20px 0;"
										/>
									</f-col>
									<f-col col="3">
										{{`${item.value.progress}%`}}
									</f-col>
								</f-row>
							</template>
						</custom-list>
					</f-tab-item>
				</f-tabs>
			</f-col>
			<f-col col="4" class="ms-pl-3">
				<f-label size="lg" class="ms-mb-2">
					{{selectedExecution ? `执行结果：${selectedExecution.hash}` : `源码摘要: 版本${source.semver}`}}
				</f-label>
				<div :style="{height: `${abstractHeight}px`}" id="abstract-container">
					<p
						v-for="(item, index) in abstract"
						:class="[item.type, 'ms-pb-1', 'ms-textTruncate']"
						:style="{'padding-left': `${25 * item.level}px`}"
						:title="item.title"
					>
						{{item.title}}
					</p>
				</div>
			</f-col>
		</f-row>
		<custom-dialog
			id="get-reporter"
			v-model="show" 
			title="下载测试报告"
			ok-text="下载"
			@ok="downloadReporter"
		>
			<f-label
				v-show="fail"
				style="color: red"
				class="ms-pt-3"
			>
				下载失败！
			</f-label>
		</custom-dialog>
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
			selectedExecution: null,
			completed: {
				selected: [],
				field: [
					{
						label: 'ID',
						key: 'hash',
						class: 'ms-w-auto'
					},
					{
						label: 'StartAt',
						key: 'startAt',
						class: 'col-130'
					},
					{
						label: 'EndAt',
						key: 'endAt',
						class: 'col-130'
					},
					{
						label: 'Pass Rate',
						key: 'passRate'
					},
					{	
						label: 'Reporter',
						key: 'reporter',
						class: 'col-100'
					},
					{
						label: 'Download',
						key: 'download',
						class: 'col-100'
					}
				],
				filter: {
					passRate: ''
				},
				downloadExecutionId: null
			},
			unfinished: {
				field: [
					{
						label: 'ID',
						key: 'hash',
						class: 'ms-w-auto'
					},
					{
						label: 'StartAt',
						key: 'startAt',
						class: 'col-130'
					},
					{
						label: 'State',
						key: 'state'
					},
					{
						label: 'Progress',
						key: 'progress'
					}
				],
				filter: {
					progress: ''
				}
			},
			filter: {
				startAt: null
			},
			options: [
				{
					text: '>=10%',
					value: 10
				},
				{
					text: '>=50%',
					value: 50
				},
				{
					text: '==100%',
					value: 100
				}
			],
			abstractHeight: '100%',
			type: 0,
			show: false,
			fail: false
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
		filteredCompleted() {
			let filteredExecutionList = this.executionList
				.map((execution) => {
					const { hash, startAt, endAt, state } = execution;

					return {
						hash, startAt, endAt, progress: (state.ended / state.length) * 100
					};
				})
				.filter(execution => execution.progress === 100);

			if (this.filter.startAt) {
				filteredExecutionList = filteredExecutionList
					.filter(execution => new Date(execution.startAt).getTime() >= new Date(this.filter.startAt).getTime())
			}

			if (this.completed.filter.passRate !== '') {
				filteredExecutionList = filteredExecutionList
					.filter(execution => {
						return execution.passRate >= this.completed.filter.passRate;
					});
			}

			return filteredExecutionList;
		},
		filteredUnfinished() {
			let filteredExecutionList = this.executionList
				.map((execution) => {
					const { hash, startAt, endAt, state } = execution;

					return {
						hash, startAt, endAt, progress: (state.ended / state.length) * 100
					};
				})
				.filter(execution => execution.progress < 100);

			if (this.filter.startAt) {
				filteredExecutionList = filteredExecutionList
					.filter(execution => new Date(execution.startAt).getTime() >= new Date(this.filter.startAt).getTime())
			}

			if (this.unfinished.filter.progress !== '') {
				filteredExecutionList = filteredExecutionList
					.filter(execution => {
						return execution.progress >= this.unfinished.filter.progress;
					});
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
			this.resetMessage();

			return Promise.all(this.completed.selected.map(execution => {
				return this.executionPlugin.delete(execution.hash);
			})).then(() => {
				this.getExecutionList();
				this.completed.selected = [];
				this.setMessage('success', '删除成功！');
			}).catch(() => {
				// TODO 删除失败
				this.setMessage('fail', '删除失败！');
			});
		},
		getHeight() {
			const height = document.body.clientHeight;

			this.abstractHeight = height - 170;
		},
		getExecuteResult(execution) {
			this.selectedExecution = execution;
		},
		downloadReporter() {

		}
	},
	mounted() {
		this.sourcePlugin = this.$http.project.source(this.projectId);
		this.executionPlugin = this.sourcePlugin.execution(this.sourceId);

		this.getSource();
		this.getProject();
		this.getExecutionList();
		this.getHeight();

		window.addEventListener('resize', this.getHeight);
	},
	destroyed() {
		window.removeEventListener('resize', this.getHeight);
	}
}
</script>

<style lang="scss">
.ms-tab-link .ms-tab-title.ms-tab-title-active {
	border: 1px solid transparent
}

.ms-dropdown-options button {
	display: block;
}

#execution-container {
	p {
		position: relative;
		margin: 0 0 3px 0;
	}

	p.suit {
		color: #323130;
		font-size: 18px;
		font-weight: 600;
	}

	p.test {
		color: #605e5c;
		font-size: 14px;
	}

	.ms-button-container {
		vertical-align: middle;

		.ms-button {
			background-color: transparent;
		}
	}

	#search-reporter-online {
		.ms-button-label {
			overflow: unset;
		}
	}
}

#abstract-container {
	overflow: auto;
}
</style>


