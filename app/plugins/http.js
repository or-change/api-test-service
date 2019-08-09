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
				async query(filter) {
					const {data: projectList} = await agent.get('/admin/project', { params: filter });

					return projectList.map(project => {
						return {
							id: project.id,
							name: project.name,
							ownerId: project.ownerId,
							createdAt: new Date(project.createdAt)
						};
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
			async query() {
				const { data: accountList } = await agent.get('/account');

				return accountList.map(account => {
					return {
						id: account.id,
						name: account.name,
						email: account.email,
						avatar: account.avatar,
						administrator: account.administrator
					};
				});
			},
			update(accountId, payload) {
				return agent.put(`/account/${accountId}`, payload);
			},
			async get(accountId) {
				const { data: account } = await agent.get(`/account/${accountId}`);

				return {
					id: account.id,
					name: account.name,
					email: account.email,
					avatar: account.avatar,
					administrator: account.administrator
				};
			}
		},
		project: {
			async create(project) {
				const { data: result } = await agent.post('/project', project);

				return {
					id: result.id,
					name: result.name,
					ownerId: result.ownerId,
					createdAt: new Date(result.createdAt)
				};
			},
			update(projectId, payload) {
				return agent.put(`/project/${projectId}`, payload);
			},
			delete(projectId) {
				return agent.delete(`/project/${projectId}`);
			},
			async query(filter) {
				const { data: projectList} = await agent.get('/project', { params: filter });

				return projectList.map(project => {
					return {
						id: project.id,
						name: project.name,
						ownerId: project.ownerId,
						createdAt: new Date(project.createdAt)
					};
				});
			},
			async get(projectId) {
				const { data: project} = await agent.get(`/project/${projectId}`);

				return {
					id: project.id,
					name: project.name,
					ownerId: project.ownerId,
					createdAt: new Date(project.createdAt)
				};
			},
			source(projectId) {
				return {
					create(payload) {
						return agent.put(`/project/${projectId}/source`, payload);
					},
					async query(filter) {
						const { data: sourceList} = await agent.get(`/project/${projectId}/source`, {
							params: filter
						});

						return sourceList.map(source => {
							return {
								id: source.id,
								projectId: source.projectId,
								agent: source.agent,
								semver: source.semver,
								initialized: source.initialized,
								createdAt: new Date(source.createdAt),
							};
						});
					},
					async get(sourceId) {
						const { data: source} = await agent.get(`/project/${projectId}/source/${sourceId}`);
						
						return {
							id: source.id,
							projectId: source.projectId,
							agent: source.agent,
							structure: source.structure,
							semver: source.semver,
							createdAt: new Date(source.createdAt)
						};
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
							async query(filter) {
								const {data: executionList } = await agent.get(`/project/${projectId}/source/${sourceId}/execution`, {
									params: filter
								});

								return executionList.map(execution => {
									return {
										id: execution.id,
										progress: execution.progress,
										status: execution.status,
										error: execution.error,
										executor: execution.executor,
										createdAt: new Date(execution.createdAt),
										endedAt: execution.endedAt && new Date(execution.endedAt),
										result: execution.result
									};
								});
							},
							async get(executionId) {
								const {data: execution } = await agent.get(`/project/${projectId}/source/${sourceId}/execution/${executionId}`);
								
								return {
									id: execution.id,
									state: execution.state,
									status: execution.status,
									executor: execution.executor,
									createdAt: new Date(execution.createdAt),
									endedAt: execution.endedAt && new Date(execution.endedAt),
									log: execution.log,
									result: execution.result
								};
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