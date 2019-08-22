<template>

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
