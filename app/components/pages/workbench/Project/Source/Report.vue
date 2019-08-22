<template>

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
			execution: {},
			parserRegister: {},
			log: {},
			api: {
				total: 0,
				success: 0
			}
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
		async getExecution() {
			this.execution = await this.$http.project.source(this.projectId).execution(this.sourceId).get(this.executionId);
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


