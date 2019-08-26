import axios from 'axios';

export default function install(Vue, { router }) {
	const agent = axios.create({
		baseURL: '/api'
	});

	function skip(error) {
		Vue.prototype.$eventBus.$emit('hide-modal');

		router.push({
			path: '/workbench/error',
			query: {
				error: error.message
			}
		});
	}

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
					try {
						const {data: projectList} = await agent.get('/admin/project', { params: filter });

						return projectList.map(project => {
							return {
								id: project.id,
								name: project.name,
								ownerId: project.ownerId,
								createdAt: new Date(project.createdAt)
							};
						});
					} catch (e) {
						return [];
					}
				},
				assign(projectId, accountId) {
					try {
						return agent.put('/admin/project/owner', {
							projectId, accountId
						});
					} catch (e) {
						skip(e);
					}
				}
			},
			version: {
				update(payload) {
					try {
						return agent.put('/admin/product', payload);
					} catch (e) {
						skip(e);
					}
				}
			},
			account: {
				create(payload) {
					try {
						return agent.post('/admin/account', payload);
					} catch (e) {
						skip(e);
					}
				},
				update(accountId, payload) {
					try {
						return agent.put(`/admin/account/${accountId}`, payload);
					} catch (e) {
						skip(e);
					}
				},
				delete(accountId) {
					try {
						return agent.delete(`/admin/account/${accountId}`);
					} catch (e) {
						skip(e);
					}
				}
			}
		},
		account: {
			async query() {
				try {
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
				} catch (e) {
					return [];					
				}
			},
			update(accountId, payload) {
				try {
					return agent.put(`/account/${accountId}`, payload);
				} catch (e) {
					skip(e);
				}
			},
			async get(accountId) {
				try {
					const { data: account } = await agent.get(`/account/${accountId}`);

					return {
						id: account.id,
						name: account.name,
						email: account.email,
						avatar: account.avatar,
						administrator: account.administrator
					};
				} catch (e) {
					return {};
				}
			}
		},
		project: {
			async create(project) {
				try {
					const { data: result } = await agent.post('/project', project);

					return {
						id: result.id,
						name: result.name,
						ownerId: result.ownerId,
						createdAt: new Date(result.createdAt)
					};
				} catch (e) {
					skip(e);
				}
			},
			update(projectId, payload) {
				try {
					return agent.put(`/project/${projectId}`, payload);
				} catch (e) {
					skip(e);
				}
			},
			delete(projectId) {
				try {
					return agent.delete(`/project/${projectId}`);
				} catch (e) {
					skip(e);
				}
			},
			async query(filter) {
				try {
					const { data: projectList} = await agent.get('/project', { params: filter });

					return projectList.map(project => {
						return {
							id: project.id,
							name: project.name,
							ownerId: project.ownerId,
							createdAt: new Date(project.createdAt)
						};
					});
				} catch (e) {
					return [];
				}
			},
			async get(projectId) {
				try {
					const { data: project} = await agent.get(`/project/${projectId}`);

					return {
						id: project.id,
						name: project.name,
						ownerId: project.ownerId,
						createdAt: new Date(project.createdAt)
					};
				} catch (e) {
					return {};
				}
			},
			source(projectId) {
				return {
					async create(payload) {
						try {
							const {data: source} = await agent.post(`/project/${projectId}/source`, payload);

							return {
								id: source.id,
								projectId: source.projectId,
								agent: source.agent,
								semver: source.semver,
								status: source.status,
								error: source.error,
								createdAt: new Date(source.createdAt),
							};

						} catch (e) {
							skip(e);
						}
					},
					async query(filter) {
						try {
							const { data: sourceList} = await agent.get(`/project/${projectId}/source`, {
								params: filter
							});
	
							return sourceList.map(source => {
								return {
									id: source.id,
									projectId: source.projectId,
									agent: source.agent,
									semver: source.semver,
									status: source.status,
									error: source.error,
									createdAt: new Date(source.createdAt),
								};
							});
						} catch (e) {
							return [];
						}
					},
					async get(sourceId) {
						try {
							const { data: source} = await agent.get(`/project/${projectId}/source/${sourceId}`);
						
							return {
								id: source.id,
								projectId: source.projectId,
								agent: source.agent,
								structure: source.structure,
								semver: source.semver,
								createdAt: new Date(source.createdAt)
							};
						} catch (e) {
							return {};
						}
					},
					delete(sourceId) {
						try {
							return agent.delete(`/project/${projectId}/source/${sourceId}`);
						} catch (e) {
							skip(e);
						}
					},
					execution(sourceId) {
						return {
							async start(payload) {
								try {
									const {data: execution } = await agent.post(`/project/${projectId}/source/${sourceId}/execution`, payload);

									return {
										id: execution.id,
										sourceId: execution.sourceId,
										progress: execution.progress,
										status: execution.status,
										error: execution.error,
										executor: execution.executor,
										createdAt: new Date(execution.createdAt),
										endedAt: execution.endedAt && new Date(execution.endedAt),
										result: execution.result
									};
								} catch (e) {
									skip(e);
								}
							},
							delete(executionId) {
								try {
									return agent.delete(`/project/${projectId}/source/${sourceId}/execution/${executionId}`);
								} catch (e) {
									skip(e);
								}
							},
							async query(filter) {
								try {
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
								} catch (e) {
									return [];
								}
							},
							async get(executionId) {
								try {
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
								} catch (e) {
									return [];
								}
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