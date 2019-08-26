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
					text: '我的项目'
				},
				{
					to: `/workbench/project/${projectId}`,
					text: projectName ? projectName : projectId
				},
				{
					text: '源代码',
					to: `/workbench/project/${projectId}`
				},
				{
					text: source.semver ? source.semver : sourceId,
					to: `/workbench/project/${projectId}/source/${sourceId}`,
					active: true
				}
			]"
		/>

		<b-row>
			<b-col cols="9">
				<b-tabs content-class="mt-3" small>
					<b-tab title="执行完成" active>
						<compeleted-list
							:items="filteredCompleted"
							:project-id="projectId"
							:source-id="sourceId"
							@select="(execution) => selectedExecution = execution"
							@delete="deleteExecution" />
					</b-tab>
					<b-tab title="未执行完成">
						<unfinished-list
							:items="filteredUnfinished" />
					</b-tab>
					<b-tab title="异常执行">
						<abnormal-list
							:items="executionList.filter(execution => !execution.progress && execution.error)"
							@delete="deleteExecution" />
					</b-tab>

					<b-button class="position-absolute" style="top: 4px;right: 0"
						size="sm" variant="primary" v-b-modal.execution-source>执行</b-button>
				</b-tabs>
			</b-col>
			<b-col cols="3">
				<h6 class="mb-2 font-weight-bold">
					{{selectedExecution ? `执行结果：${selectedExecution.id}` : `源码摘要: 版本${source.semver}`}}
				</h6>

				<structure 
					:structure="structure"
				/>
			</b-col>
		</b-row>

		<b-modal id="execution-source" size="sm" title="开始执行" centered button-size="sm"
			@ok.prevent="startExecution" ok-title="执行" ok-only
		>
			<div>
				<label for="executor" class="align-middle mb-0">执行器：</label>
				<b-form-select
					id="executor" size="sm" class="d-inline-block align-middle mr-3" style="width: 10em"
					v-model="execution.executor" :options="executorOptions"
				></b-form-select>

				<component
					ref="start-execution"
					:is="$product.executor[execution.executor] ? $product.executor[execution.executor].create : ''"
					@success="executionSuccess"
				/>
			</div>
		</b-modal>
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
			}
		}
	},
	computed: {
		filteredCompleted() {
			return this.executionList
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
			return this.executionList
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
		async deleteExecution(selected) {
			await Promise.all(selected.map(id => {
				return this.$http.project.source(this.projectId).execution(this.sourceId).delete(id);
			}));
	
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

<style lang="scss">
.tabs {
	position: relative;
}
</style>