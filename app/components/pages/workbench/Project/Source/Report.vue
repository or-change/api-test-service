<template>
	<div id="reporter-container">
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
				},
				{
					text: '报告',
					href: `#/workbench/project/${projectId}/source/${sourceId}/execution/${executionId}/reporter`
				}
			]"
		/>

		<div class="ms-py-3">
			<h3 class="ms-center">测试报告</h3>

			<div class="ms-mt-4 ms-center">
				<f-label class="ms-d-inline">用例通过率: {{ `${passRate * 100}% `}}</f-label>
				<f-label class="ms-d-inline ms-ml-3">接口请求成功率: {{ `${(api.success / api.total) * 100}% `}}</f-label>
			</div>

			<f-row>
				<f-col col="9">
					<div v-for="(item, index) in structure">
						<p
							class="ms-textTruncate"
							:style="{'padding-left': `${25 * item.level}px`}"
							:title="item.title"
							v-if="item.type === 'suit'"
						>
							<f-label size="lg">{{item.title}}</f-label>
						</p>

						<div v-else :style="{'padding-left': `${25 * item.level}px`}">
							<f-message-bar
								class="ms-mt-2"
								multiLine
								toggle
								:variant="item.result === -1 ? 'danger' : 'success'"
								:icon="item.result === -1 ? 'fail ms-Icon ms-Icon--ErrorBadge' : 'success ms-Icon ms-Icon--CompletedSolid'"
								:text="item.title">
								<div slot="messageBar-text" class="ms-message-bar-text">
									{{ item.title }}
									<p v-for="(item, key) in log[item.path]" v-html="item" class="ms-mt-3"></p>
								</div>
							</f-message-bar>
						</div>

					</div>
				</f-col>
				<f-col col="3" class="ms-pl-3">
					<structure
						:structure="structure"
					/>
				</f-col>
			</f-row>
		</div>
	</div>
</template>

<script>
import Vue from 'vue';
import mixin from './mixin';
import Parse from '@or-change/tdk/parser';
import Structure from './Structure';

export default {
	mixins: [mixin],
	components: {
		Structure
	},
	data() {
		return {
			execution: null,
			parserRegister: {},
			log: {},
			api: {
				total: 0,
				success: 0
			},
			passRate: 0
		}
	},
	computed: {
		executionId() {
			return this.$route.params.executionId;
		},
		resultMapping() {
			const result = {};

			if (!this.execution) {
				return result;
			} else {
				this.execution.result.forEach(execution => {
					result[execution.join('-')] = true;
				});
			}

			return result;
		},
		structure() {
			if (!this.source.structure) {
				return [];
			}

			const structure = this.constructList(this.source.structure);

			if (this.execution) {
				const result = this.execution.result.map(item => item.join('-'));


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
		async getExecution() {
			this.execution = await this.$http.project.source(this.projectId).execution(this.sourceId).get(this.executionId);
			this.passRate = (this.source.structure.total - this.execution.result.length) / this.source.structure.total;
			this.log = {};

			this.execution.log.forEach((item) => {
				this.parserRegister[item.type].write(item.message);
			});
		},
		registerParser() {
			let currentKey = '';

			this.parserRegister.tdk = Parse({
				on: {
					casestart:(path) => {
						currentKey = path.join('-');

						if (!this.log[currentKey]) {
							this.log[currentKey] = [];
						}
					},
					fail: (path, error) => {
						this.log[path.join('-')].push(`错误信息：${error}`);
					},
					caseend: () => {
						currentKey = null;
					}
				}
			});

			this.parserRegister.agent = {
				write: (message) => {
					const info = JSON.parse(message);
					const {
						method, url, status, statusText, duration,
						headers, timeStamp
					} = info;

					const date = Vue.filter('dateFormat')(new Date(timeStamp));

					if (info.type === 0) {
						this.api.total++;

						return this.log[currentKey].push(`${method.toUpperCase()}&nbsp;&nbsp;请求&nbsp;&nbsp;${url}&nbsp;&nbsp;开始于&nbsp;&nbsp;${date};`);
					}

					if (info.type === 1) {
						this.api.success++;

						return this.log[currentKey].push(`${method.toUpperCase()}&nbsp;&nbsp;请求&nbsp;&nbsp;${url}&nbsp;&nbsp;结束于&nbsp;&nbsp;${date}; <br /> 状态码：${status}; <br /> 状态描述：${statusText}; <br />
							请求头部为：${JSON.stringify(headers)}
						`);
					}

					if (!info.type) {
						this.log[currentKey].push(`${method.toUpperCase()}&nbsp;&nbsp;请求&nbsp;&nbsp;${url}&nbsp;&nbsp;耗时${duration}ms;`);
					}
				}
			}
		}
	},
	mounted() {
		this.getExecution();
		this.registerParser();
	}
}
</script>

<style lang="scss">
#reporter-container {
	.ms-message-bar-single .ms-message-bar-content .ms-message-bar-text p{
		display: none;
	}

	.ms-message-bar-multi .ms-message-bar-content .ms-message-bar-text p {
		display: block;
	}

	.ms-message-bar-md .ms-message-bar-icon,
	.ms-message-bar-md .ms-message-bar-text {
		padding-top: 10px;
    padding-bottom: 10px;
	}

	.ms-message-bar-md .ms-message-bar-multi-button {
    width: 40px;
    height: 28px;
	}
}
</style>


