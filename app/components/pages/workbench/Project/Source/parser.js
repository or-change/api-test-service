import Vue from 'vue';
import Parse from '@or-change/tdk/parser';

export default {
	methods: {
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
			};
		}
	}
};