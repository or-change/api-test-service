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
			<f-col col="9">
				<f-label size="lg" class="ms-mb-2">执行列表</f-label>
				<f-row style="position: relative" class="ms-mb-2">
					<f-col col="2">
						<f-datepicker v-model="filter.createdAt" label="开始时间" overlaid size="sm" />
					</f-col>
					<f-col col="2" class="ms-ml-2">
						<f-label>执行器</f-label>
						<f-dropdown
							:options="executorOptions"
							placeholder="选择执行器"
							v-model="filter.executor"
							multi-select
						/>
					</f-col>
					<f-button 
						text="执行"
						variant="primary"
						@click="dialog.execution = true"
						style="margin-top: 18px;"
						class="ms-ml-3"
					/>
				</f-row>

				<f-tabs v-model="type" type="link">
					<f-tab-item title="执行完成">
						<compeleted-list
							:options="options"
							:items="filteredCompleted"
							:project-id="projectId"
							:source-id="sourceId"
							@select="(execution) => selectedExecution = execution"
							@delete="getExecutionList" />
					</f-tab-item>
					<f-tab-item title="未执行完成">
						<unfinished-list
							:items="filteredUnfinished"
							:options="options" />
					</f-tab-item>
					<f-tab-item title="异常执行">
						<abnormal-list
							:items="filteredExecutionList.filter(execution => !execution.progress && execution.error)"
							:project-id="projectId"
							:source-id="sourceId"
							@delete="getExecutionList" />
					</f-tab-item>
				</f-tabs>
			</f-col>
			<f-col col="3" class="ms-pl-3">
				<f-label size="lg" class="ms-mb-2">
					{{selectedExecution ? `执行结果：${selectedExecution.id}` : `源码摘要: 版本${source.semver}`}}
				</f-label>

				<structure 
					:structure="structure"
				/>
			</f-col>
		</f-row>
		<custom-dialog
			id="start-execution"
			v-model="dialog.execution" 
			title="开始执行"
			ok-text="执行"
			@ok="startExecution"
		>
			
			<div class="dropdown-container ms-mb-2">
				<f-label class="ms-d-inline-block ms-p-0 label-dropdown">执行器</f-label>
				<f-dropdown
					class="ms-d-inline-block"
					:options="executorOptions"
					placeholder="选择方式"
					v-model="execution.executor"
					style="width: 216px;"
				/>
			</div>

			<component
				ref="start-execution"
				:is="$product.executor[execution.executor] ? $product.executor[execution.executor].create : ''"
				@success="executionSuccess"
			></component>
		</custom-dialog>
		<custom-dialog
			id="get-reporter"
			v-model="dialog.report" 
			title="下载测试报告"
			ok-text="下载"
			@ok="downloadReporter"
		>
		</custom-dialog>
	</div>
</template>

<script>
import CompeletedList from './Completed';
import UnfinishedList from './Unfinished';
import AbnormalList from './Abnormal';
import Structure from '../Structure';

import mixin from '../mixin';

export default {
	mixins: [mixin],
	components: {
		CompeletedList, UnfinishedList, AbnormalList, Structure
	},
	data() {
		return {
			executionList: [],
			selectedExecution: null,
			execution: {
				executor: ''
			},
			filter: {
				createdAt: null,
				executor: []
			},
			options: [
				{
					text: '>=10%',
					value: 0.1
				},
				{
					text: '>=50%',
					value: 0.5
				},
				{
					text: '==100%',
					value: 1
				}
			],
			type: 0,
			dialog: {
				execution: false,
				report: false
			}
		}
	},
	computed: {
		filteredExecutionList() {
			return this.executionList.filter((execution) => {
				const { createdAt, executor } = this.filter;

				const createAtFilter = createdAt ? execution.createdAt >= createdAt : true;
				const executorFilter = executor.length ? executor.indexOf(execution.executor) !== -1 : true;

				return createAtFilter && executorFilter;
			}).sort((a, b) => b.createdAt - a.createdAt);
		},
		filteredCompleted() {
			return this.filteredExecutionList
				.filter(execution => execution.progress && execution.progress.ended === execution.progress.length)
				.map((execution) => {
					if (!execution.result || !this.source.structure) {
						execution.passRate = 0;

						return execution;
					}	

					execution.passRate = (this.source.structure.total - execution.result.length) / this.source.structure.total;

					return execution;
				});
		},
		filteredUnfinished() {
			return this.filteredExecutionList
				.filter(execution =>  execution.status !== 3 && !execution.error)
				.map((execution) => {
					const {
						progress
					} = execution;

					execution.progress = progress ? progress.ended / progress.length : 0;

					return execution;
				});
		},
		executorOptions() {
			const executorOptions = [];
			const { executor } = this.$product;

			for (let key in executor) {
				executorOptions.push({
					text:	executor[key].name,
					value: key
				})
			}

			this.execution.executor = executorOptions[0] ? executorOptions[0].value : '';

			return executorOptions;
		},
		structure() {
			if (!this.source.structure) {
				return [];
			}

			const structure = this.constructList(this.source.structure);

			if (this.selectedExecution && this.selectedExecution.result) {
				const result = this.selectedExecution.result.map(item => item.join('-'));


				structure.forEach(item => {
					if (item.type === 'test') {
						result.indexOf(item.path) !== -1 ? item.result = -1 : item.result = 1;
					}
				});
			}

			return structure;
		}
	},
	methods: {
		async getExecutionList() {
			this.executionList = await this.$http.project.source(this.projectId).execution(this.sourceId).query();
		},
		async startExecution() {
			const execution = await this.$http.project.source(this.projectId).execution(this.sourceId).start(this.execution);
			await this.$refs['start-execution'].submit(execution.id);
		},
		async executionSuccess() {
			this.dialog.execution = false;
			await this.getExecutionList();
		},
		downloadReporter() {

		}
	},
	mounted() {
		this.getExecutionList();
	}
}
</script>