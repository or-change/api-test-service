<template>
	<div class="mt-3" id="reporter-container">
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
				},
				{
					text: '报告',
					to: `/workbench/project/${projectId}/source/${sourceId}/execution/${executionId}/reporter`,
					active: true
				}
			]"
		/>

		<div>
			<h5 class="text-center font-weight-bold">测试报告</h5>
			<div class="mt-3 text-center">
				<label>用例通过率: {{ `${Math.round(passRate * 100)}% `}}</label>
				<label class="ml-3">接口请求成功率: {{ `${(api.success / api.total) * 100}% `}}</label>
			</div>

			<b-row>
				<b-col cols="9">
					<div v-for="(item, index) in structure">
						<p class="mb-0  text-truncate" :title="item.title"
							:style="{'padding-left': `${25 * item.level}px`}"
							v-if="item.type === 'suit'"
						>
							<label class="mb-0 suit-title">{{item.title}}</label>
						</p>

						<div v-else :style="{'padding-left': `${25 * item.level}px`}">
							<b-alert class="my-2 p-1 position-relative" show
								:variant="item.result === -1 ? 'danger' : (item.result === 1 ? 'success' : 'secondary')">
								<b-button variant="outline-primary" size="sm"
									class="toggle py-0 position-absolute"
									v-show="log[item.path] && log[item.path].length"
									@click="toggle(item.path)"
								>
									<i :class="[
										visible.indexOf(item.path) !== -1 ? 'fas fa-angle-double-up' : 'fas fa-angle-double-down'
									]" />
								</b-button>
								<p class="mb-0  text-truncate pr-2" :title="item.title">
									{{ item.title }}
								</p>

								<b-collapse :id="item.path" :visible="visible.indexOf(item.path) !== -1">
									<p v-for="(item, key) in log[item.path]" v-html="item" class="mt-3 text-white"></p>
								</b-collapse>
							</b-alert>
						</div>
					</div>
				</b-col>
				<b-col cols="3">
					<structure
						:structure="structure" :offset="217"
					/>
				</b-col>
			</b-row>
		</div>
	</div>
</template>

<script>
import mixin from './mixin';
import parser from './parser';

import Structure from './Structure';

export default {
	mixins: [mixin, parser],
	components: {
		Structure
	},
	data() {
		return {
			execution: {},
			parserRegister: {},
			log: {},
			api: {
				total: 0,
				success: 0
			},
			visible: []
		}
	},
	watch: {
		$route(to, from) {
			console.log(to, from)
		}
	},
	computed: {
		executionId() {
			return this.$route.params.executionId;
		},
		structure() {
			if (!this.source.structure) {
				return [];
			}

			const structure = this.constructList(this.source.structure);

			if (this.execution.result) {
				const result = this.execution.result.map(item => item.join('-'));

				structure.forEach(item => {
					if (item.type === 'test') {
						result.indexOf(item.path) !== -1 ? item.result = -1 : item.result = 1;
					}
				});
			}

			return structure;
		},
		passRate() {
			if (!this.source.structure || !this.execution.result) {
				return 0;
			}

			return (this.source.structure.total - this.execution.result.length) / this.source.structure.total;
		}
	},
	methods: {
		toggle(path) {
			const index = this.visible.indexOf(path);

			if (index === -1) {
				this.visible.push(path);
			} else {
				this.visible.splice(index, 1);
			}
		},
		async getExecution() {
			this.execution = await this.$http.project.source(this.projectId).execution(this.sourceId).get(this.executionId);
			this.log = {};

			if (!this.execution.log) {
				return;
			}

			this.execution.log.forEach((item) => {
				this.parserRegister[item.type].write(item.message);
			});
		},

	},
	mounted() {
		this.getExecution();
		this.registerParser();
	}
}
</script>

<style lang="scss">
#reporter-container {
	.suit-title {
		font-size: 16px;
		font-weight: 600;
	}

	p {
		cursor: default;
	}

	.toggle {
		width: 2em;
		top: 6px;
		right: 0;
		text-align: right;
		border: none;
		outline: none;
		box-shadow: none;
		background-color: transparent;
		color: inherit;
	}
}
</style>


