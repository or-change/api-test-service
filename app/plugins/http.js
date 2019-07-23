import axios from 'axios';

export default function install(Vue) {
	const agent = axios.create({
		baseURL: '/api'
	});

	Vue.$http = Vue.prototype.$http = {
		product: {
			async get() {
				const { data: product } = await agent.post('/product');

				return product;
			}
		},
		principal: {
			async signin(credential) {
				const { type, body } = credential;

				const { data: principal } = await agent.post('/session/account', body, {
					params: { type }
				});

				return principal;
			},
			async signout() {
				await agent.delete('/session/account');
			},
			async get() {
				const { data: product } = await agent.get('/session/account');

				return product;
			},
			update(account) {
				return agent.put('/session/account', account);
			}
		},
		admin: {
			overview: {

			},
			project: {
				get(projectId) {

				},
				query(filter) {

				},
				assign(projectId, accountId) {

				}
			},
			version: {

			}
		},
		project: {
			create() {
				return agent.post('/project');
			},
			update(projectId, payload) {
				return agent.put(`/project/${projectId}`, payload);
			},
			delete(projectId) {
				return agent.delete(`/project/${projectId}`);
			},
			query(filter) {
				return agent.get('/project', { params: filter });
			},
			get(projectId) {
				return agent.get(`/project/${projectId}`);
			},
			source(projectId) {
				return {
					create(payload) {
						return agent.put(`/project/${projectId}/source`, payload);
					},
					query(filter) {
						return agent.get(`/project/${projectId}/source`, {
							params: filter
						});
					},
					delete(sourceId) {
						return agent.delete(`/project/${projectId}/source/${sourceId}`);
					},
					execution(sourceId) {
						return {
							start(payload) {
								return agent.post(`/project/${projectId}/source/${sourceId}/execution`, payload);
							},
							delete(executionId) {
								return agent.delete(`/project/${projectId}/source/${sourceId}/execution/${executionId}`);
							},
							query(filter) {
								return agent.get(`/project/${projectId}/source/${sourceId}/execution`, {
									params: filter
								});
							},
							get(executionId) {
								return agent.get(`/project/${projectId}/source/${sourceId}/execution/${executionId}`);
							},
							report(executionId) {
								return {
									create(type) {
										return agent.get(`/project/${projectId}/source/${sourceId}/execution/${executionId}/report/${type}`);
									}
								};
							}
						};
					}
				};
			}
		},
	};
}