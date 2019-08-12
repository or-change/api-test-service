import mixin from './mixin';

export default {
	data() {
		return {
			executionList: [],
			selectedExecution: null,
			execution: {
				executor: ''
			},
			completed: {
				selected: [],
				field: [
					{
						label: 'ID',
						key: 'id',
						class: 'ms-w-auto'
					},
					{
						label: 'Pass Rate',
						key: 'passRate'
					},
					{	
						label: 'Reporter',
						key: 'reporter',
						class: 'col-90'
					},
					// {
					// 	label: 'Download',
					// 	key: 'download',
					// 	class: 'col-90'
					// },
					{
						label: 'Executor',
						key: 'executor',
						class: 'col-100'
					},
					{
						label: 'CreatedAt',
						key: 'createdAt',
						class: 'col-100'
					},
					{
						label: 'EndedAt',
						key: 'endedAt',
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
						key: 'id',
						class: 'ms-w-auto'
					},
					{
						label: 'Progress',
						key: 'progress'
					},
					{
						label: 'Status',
						key: 'status'
					},
					{
						label: 'Executor',
						key: 'executor'
					},
					{
						label: 'CreatedAt',
						key: 'createdAt',
						class: 'col-130'
					}
				],
				filter: {
					progress: '',
					status: []
				}
			},
			abnormal: {
				field: [
					{
						label: 'ID',
						key: 'id',
						class: 'ms-w-auto'
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
						label: 'Executor',
						key: 'executor'
					},
					{
						label: 'CreatedAt',
						key: 'createdAt',
						class: 'col-130'
					}
				],
				filter: {
					status: []
				},
				selected: []
			},
			filter: {
				createdAt: null,
				executor: []
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
			executionDialog: false
		};
	},
	mixins: [mixin],
	computed: {
		filteredExecutionList() {
			let filteredExecutionList = this.executionList;

			if (this.filter.createdAt) {
				filteredExecutionList = filteredExecutionList
					.filter(execution => execution.createdAt >= this.filter.createdAt);
			}

			if (this.filter.executor && this.filter.executor.length !== 0) {
				filteredExecutionList = filteredExecutionList
					.filter(execution => this.filter.executor.indexOf(execution.executor) !== -1);
			}

			return filteredExecutionList.sort((a, b) => b.createdAt - a.createdAt);
		},
		filteredCompleted() {
			const filteredExecutionList = this.filteredExecutionList
				.filter(execution => execution.progress && execution.progress.ended === execution.progress.length)
				.map((execution) => {
					const {
						id, status, executor, createdAt,
						result, endedAt
					} = execution;

					return {
						id, status, executor, createdAt,
						endedAt, result,
						passRate: (this.source.structure.total - result.length) / this.source.structure.total * 100
					};
				});

			if (this.completed.filter.passRate !== '') {
				return filteredExecutionList
					.filter(execution => {
						return execution.passRate >= this.completed.filter.passRate;
					});
			}

			return filteredExecutionList;
		},
		filteredUnfinished() {
			let filteredExecutionList = this.filteredExecutionList
				.filter(execution => ((execution.progress && execution.progress.ended < execution.progress.length) || execution.status !== 3) && !execution.error)
				.map((execution) => {
					const {
						id, status, executor, createdAt, progress
					} = execution;

					return {
						id, status, executor, createdAt,
						progress: progress ? progress.ended / progress.length * 100 : 0
					};
				});

			if (this.unfinished.filter.progress !== '') {
				filteredExecutionList = filteredExecutionList
					.filter(execution => {
						return execution.progress >= this.unfinished.filter.progress;
					});
			}

			if (this.unfinished.filter.status && this.unfinished.filter.status.length !== 0) {
				filteredExecutionList = filteredExecutionList
					.filter(execution => {
						return this.unfinished.filter.status.indexOf(execution.status) !== -1;
					});
			}

			return filteredExecutionList;
		},
		filteredAbnormal() {
			let filteredExecutionList = this.filteredExecutionList
				.filter(execution => !execution.progress && execution.error);

			if (this.abnormal.filter.status && this.abnormal.filter.status.length !== 0) {
				filteredExecutionList = filteredExecutionList
					.filter(execution => {
						return this.abnormal.filter.status.indexOf(execution.status) !== -1;
					});
			}

			return filteredExecutionList;
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
			this.executionDialog = false;
			await this.getExecutionList();
		},
		async deleteExecution(options) {
			await Promise.all(options.selected.map(execution => {
				return this.$http.project.source(this.projectId).execution(this.sourceId).delete(execution.id);
			}));

			await this.getExecutionList();
			options.selected = [];
		},
		getHeight() {
			const height = document.body.clientHeight;

			this.abstractHeight = height - 170;
		},
		downloadReporter() {

		}
	},
	mounted() {
		this.getExecutionList();
		this.getHeight();

		window.addEventListener('resize', this.getHeight);
	},
	destroyed() {
		window.removeEventListener('resize', this.getHeight);
	}
};