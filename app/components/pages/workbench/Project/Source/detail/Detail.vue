<template>
	
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