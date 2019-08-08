import axios from 'axios';

export default function install(Vue) {
	const agent = axios.create({
		baseURL: '/api'
	});

	Vue.$http = Vue.prototype.$http = {
		product: {
			async get() {
				const { data: product } = await agent.get('/product');

				return product;
			}
		},
		principal: {
			async signin(credential) {
				const { type, body } = credential;

				const { data: principal } = await agent.post('/session/principal', body, {
					params: { type }
				});

				return principal;
			},
			async signout() {
				await agent.delete('/session/principal');
			},
			async get() {
				const { data: principal } = await agent.get('/session/principal');

				return principal;
			},
			update(account) {
				return agent.put('/session/principal', account);
			}
		},
		admin: {
			overview: {
				get() {
					return agent.get('/admin/overview');
				}
			},
			project: {
				query(filter) {
					return agent.get('/admin/project', { params: filter }).then(({data}) => {
						return data.map(project => {
							return {
								id: project.id,
								name: project.name,
								ownerId: project.ownerId,
								createdAt: new Date(project.createdAt)
							};
						});
					});

				},
				assign(projectId, accountId) {
					return agent.put('/admin/project/owner', {
						projectId, accountId
					});
				}
			},
			version: {
				update(payload) {
					return agent.put('/admin/product', payload);
				}
			},
			account: {
				create(payload) {
					return agent.post('/admin/account', payload);
				},
				update(accountId, payload) {
					return agent.put(`/admin/account/${accountId}`, payload);
				},
				delete(accountId) {
					return agent.delete(`/admin/account/${accountId}`);
				}
			}
		},
		account: {
			query() {
				return agent.get('/account').then(({data}) => {
					return data.map(account => {
						return {
							id: account.id,
							name: account.name,
							email: account.email,
							avatar: account.avatar,
							administrator: account.administrator
						};
					});
				});
			},
			update(accountId, payload) {
				return agent.put(`/account/${accountId}`, payload).then(({data}) => {
					return {
						id: data.id,
						name: data.name,
						email: data.email,
						avatar: data.avatar,
						administrator: data.administrator
					};
				});
			},
			get(accountId) {
				return agent.get(`/account/${accountId}`).then(({data}) => {
					return {
						id: data.id,
						name: data.name,
						email: data.email,
						avatar: data.avatar,
						administrator: data.administrator
					};
				});
			}
		},
		project: {
			create(project) {
				return agent.post('/project', project).then(({data}) => data);
			},
			update(projectId, payload) {
				return agent.put(`/project/${projectId}`, payload);
			},
			delete(projectId) {
				return agent.delete(`/project/${projectId}`);
			},
			query(filter) {
				return agent.get('/project', { params: filter }).then(({data}) => {
					return data.map(project => {
						return {
							id: project.id,
							name: project.name,
							ownerId: project.ownerId,
							createdAt: new Date(project.createdAt)
						};
					});
				});
			},
			get(projectId) {
				return agent.get(`/project/${projectId}`).then(({data}) => {
					return {
						id: data.id,
						name: data.name,
						ownerId: data.ownerId,
						createdAt: new Date(data.createdAt)
					};
				});
			},
			source(projectId) {
				return {
					create(payload) {
						return agent.put(`/project/${projectId}/source`, payload);
					},
					query(filter) {
						return agent.get(`/project/${projectId}/source`, {
							params: filter
						}).then(({data}) => {
							return data.map(source => {
								return {
									id: source.id,
									projectId: data.projectId,
									agent: data.agent,
									semver: source.semver,
									avaliable: source.avaliable,
									createdAt: new Date(source.createdAt),
								};
							});
						});
					},
					get(sourceId) {
						return agent.get(`/project/${projectId}/source/${sourceId}`).then(({data}) => {
							return {
								id: data.id,
								projectId: data.projectId,
								agent: data.agent,
								structure: data.structure,
								semver: data.semver,
								createdAt: new Date(data.createdAt)
							};
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
								}).then(({data}) => {
									return data.map(execution => {
										return {
											id: execution.id,
											progress: execution.state,
											status: execution.status,
											executor: execution.executor,
											createdAt: new Date(execution.createdAt),
											endedAt: execution.endedAt && new Date(execution.endedAt),
											log: execution.log,
											result: execution.result
										};
									});
								});
							},
							get(executionId) {
								return agent.get(`/project/${projectId}/source/${sourceId}/execution/${executionId}`)
									.then(({data}) => {
										return {
											id: data.id,
											state: data.state,
											status: data.status,
											executor: data.executor,
											createdAt: new Date(data.createdAt),
											endedAt: data.endedAt && new Date(data.endedAt),
											log: data.log,
											result: data.result
										};
									});
							},
							report(executionId) {
								return {
									get(type) {
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