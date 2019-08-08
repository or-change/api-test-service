import mixin from './mixin';

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
			executionList: [],
			selectedExecution: null,
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
						class: 'col-100'
					},
					{
						label: 'Download',
						key: 'download',
						class: 'col-100'
					},
					{
						label: 'Executor',
						key: 'executor'
					},
					{
						label: 'CreatedAt',
						key: 'createdAt',
						class: 'col-130'
					},
					{
						label: 'EndAt',
						key: 'endAt',
						class: 'col-130'
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
						key: 'Status'
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
					status: ''
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
						key: 'Status'
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
					status: ''
				},
				selected: []
			},
			filter: {
				createdAt: null,
				executor: null
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
			show: false
		};
	},
	mixins: [mixin],
	computed: {
		abstract() {
			if (this.source.structure) {
				return constructList(this.source.structure);
			}

			return [];
		},
		filteredExecutionList() {
			let filteredExecutionList = this.executionList;

			if (this.filter.createdAt) {
				filteredExecutionList = filteredExecutionList
					.filter(execution => execution.createdAt >= this.filter.createdAt);
			}

			if (this.filter.executor) {
				filteredExecutionList = filteredExecutionList
					.filter(execution => execution.executor >= this.filter.executor);
			}

			return filteredExecutionList;
		},
		filteredCompleted() {
			let filteredExecutionList = this.filteredExecutionList
				.filter(execution => execution.progress && execution.progress.ended === execution.progress.length);

			if (this.completed.filter.passRate !== '') {
				filteredExecutionList = filteredExecutionList
					.filter(execution => {
						return execution.passRate >= this.completed.filter.passRate;
					});
			}

			return filteredExecutionList;
		},
		filteredUnfinished() {
			let filteredExecutionList = this.filteredExecutionList
				.filter(execution => execution.progress && execution.progress.ended < execution.progress.length && execution.status !== 3);

			if (this.unfinished.filter.progress !== '') {
				filteredExecutionList = filteredExecutionList
					.filter(execution => {
						return execution.progress >= this.unfinished.filter.progress;
					});
			}

			if (this.unfinished.filter.status !== '') {
				filteredExecutionList = filteredExecutionList
					.filter(execution => {
						return execution.status === this.unfinished.filter.status;
					});
			}

			return filteredExecutionList;
		},
		filteredAbnormal() {
			let filteredExecutionList = this.filteredExecutionList
				.filter(execution => !execution.progress && execution.status !== 3);

			if (this.abnormal.filter.status !== '') {
				filteredExecutionList = filteredExecutionList
					.filter(execution => {
						return execution.status === this.abnormal.filter.status;
					});
			}

			return filteredExecutionList;
		},
		executorOptions() {
			return [];
		},
		statusOptions() {
			return [];
		}
	},
	methods: {
		async getExecutionList() {
			this.executionList = await this.$http.project.source(this.projectId).execution(this.sourceId).query();
		},
		async startExecution() {
			await this.$http.project.source(this.projectId).execution(this.sourceId).start({});

			await this.getExecutionList();
		},
		async deleteExecution(selected) {
			await Promise.all(selected.map(execution => {
				return this.$http.project.source(this.projectId).execution(this.sourceId).delete(execution.hash);
			}));

			await this.getExecutionList();
			this.completed.selected = [];
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
		this.getExecutionList();
		this.getHeight();

		window.addEventListener('resize', this.getHeight);
	},
	destroyed() {
		window.removeEventListener('resize', this.getHeight);
	}
};