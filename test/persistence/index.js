const mock = {
	account: require('./account.json'),
	project: require('./project.json'),
	source: require('./source.json'),
	execution: require('./execution.json')
};

const Data = {
	Account() {
		return mock.account.map(account => {
			return Object.assign({}, account);
		});
	},
	Project() {
		return mock.project.map(project => {
			project.createdAt = new Date(project.createdAt);

			return Object.assign({}, project);
		});
	},
	Source() {
		return mock.source.map(source => {
			source.createdAt = new Date(source.createdAt);

			return Object.assign({}, source);
		});
	},
	Execution() {
		return mock.execution.map(execution => {
			execution.createdAt = new Date(execution.createdAt);

			return Object.assign({}, execution);
		});
	}
};

exports.DB = function DB() {
	const data = {
		account: Data.Account(),
		project: Data.Project(),
		source: Data.Source(),
		execution: Data.Execution()
	};

	const store = {
		getAccountById(id) {
			return data.account.find(account => account.id === id);
		},
		createAccount({ name, administrator, email, avatar }) {
			const id = Math.random().toString(16).substr(2, 8);
			const account = {
				id, name, administrator, email, avatar
			};

			data.account.push(account);

			return account;
		},
		destroyAccount(id) {
			const index = data.account.indexOf(id);

			if (index === -1) {
				throw new Error('No account.');
			}

			return data.account.splice(index, 1)[0];
		},
		updateAccount(id, items) {
			const account = data.account.find(account => account.id === id);

			if (!account) {
				throw new Error('No account.');
			}

			for (const key in account) {
				if (items[key] !== undefined) {
					account[key] = items[key];
				}
			}

			return account;
		},
		queryAccountByName({ name, exact = false }) {
			const pattern = exact ? new RegExp(`^${name}$`) : new RegExp(name, 'i');

			return data.account.filter(account => pattern.test(account.name));
		},
		queryAccountAll() {
			return data.account;
		},
		getProjectById(id) {
			return data.project.find(project => project.id === id) || null;
		},
		createProject({ name, ownerId }) {
			const newProject = {
				name,
				ownerId,
				id: Math.random().toString(16).substr(2, 8),
				createdAt: new Date()
			};

			data.project.push(newProject);

			return newProject;
		},
		updateProject(id, items) {
			const project = data.project.find(project => project.id === id);

			if (!project) {
				throw new Error('No project.');
			}

			for (const key in project) {
				if (items[key] !== undefined) {
					project[key] = items[key];
				}
			}

			return project;
		},
		destroyProject(id) {
			const index = data.project.findIndex(project => project.id === id);

			if (index === -1) {
				throw new Error('No project.');
			}

			return data.project.splice(index, 1)[0];
		},
		queryProjectByOwnerId({ ownerId }) {
			return data.project.filter(project => project.ownerId === ownerId);
		},
		queryProjectAll() {
			return data.project;
		},
		getSourceById(sourceId, projectId) {
			return data.source.find(source => {
				return source.id === sourceId && source.projectId === projectId;
			}) || null;
		},
		createSource({ projectId, agent, semver }) {
			const newSource = {
				projectId,
				agent,
				initialized: false,
				semver,
				id: Math.random().toString(16).substr(2, 8),
				createdAt: new Date(),
				structure: null
			};

			data.source.push(newSource);

			return newSource;
		},
		destroySource(sourceId, projectId) {
			const index = data.source.findIndex(source => {
				return source.id === sourceId && source.projectId === projectId;
			});

			if (index === -1) {
				throw new Error('No source.');
			}

			return data.source.splice(index, 1)[0];
		},
		setSourceStructure(sourceId, projectId, structure) {
			const source = data.source.find(source => {
				return source.id === sourceId && source.projectId === projectId;
			});

			if (!source) {
				throw new Error('No source.');
			}

			source.structure = structure;
			source.initialized = true;

			return source;
		},
		querySourceByProjectId({ projectId, initialized = true }) {
			return data.source.filter(source => {
				return source.projectId === projectId &&
					source.initialized === initialized;
			}).map(project => {
				const abstract = Object.assign({}, project);

				delete abstract.structure;

				return abstract;
			});
		},
		createExecution({ sourceId, executor }) {
			const execution = {
				id: Math.random().toString(16).substr(2, 8),
				sourceId,
				executor,
				progress: null,
				status: -1,
				error: null,
				createdAt: new Date(),
				endedAt: null,
				log: null,
				result: null
			};

			data.execution.push(execution);

			return execution;
		},
		getExecutionById(executionId, sourceId) {
			const executionData = data.execution.find(execution => {
				return execution.id === executionId && execution.sourceId === sourceId;
			});

			if (!executionData) {
				return null;
			}

			const execution =  Object.assign({}, executionData);

			execution.createdAt = new Date(execution.createAt);
			execution.endedAt = execution.endedAt && new Date(execution.endedAt);

			return execution;
		},
		updateExecution() {

		},
		destroyExecution(executionId, sourceId) {
			const index = data.execution.findIndex(execution => {
				return execution.id === executionId && execution.sourceId === sourceId;
			});

			if (index === -1) {
				return null;
			}

			const execution =  Object.assign({}, data.execution.splice(index, 1)[0]);

			execution.createdAt = new Date(execution.createAt);
			execution.endedAt = execution.endedAt && new Date(execution.endedAt);

			return execution;
		},
		queryExecutionBySourceId({ sourceId }) {
			return data.execution.filter(execution => {
				return execution.sourceId === sourceId;
			}).map(execution => {
				const abstract = Object.assign({}, execution);

				abstract.createdAt = new Date(abstract.createdAt);
				abstract.endedAt = abstract.endedAt && new Date(abstract.endedAt);
				delete abstract.log;

				return abstract;
			});
		}
	};

	return { store, data };
};