const path = require('path');
const fs = require('fs-extra');
const { spawn } = require('child_process');
const Observer = require('./observer');
const Manager = require('./manager');
const unzip = require('./unzip');

const ID = {
	SOURCE_AGENT: 'basic.local',
	EXECUTOR: 'basic.local'
};

module.exports = function BasicSuitePluginProvider() {
	const sourceBufferStore = {};

	return {
		name: 'Examiner Basic Plugin Suite',
		id: 'com.oc.basic',
		version: '1.0.0',
		description: 'Basic functions for getting started.',
		install: function BasicSuitePluginInstall(examiner, { temp }) {
			const manager = Manager();
			const observer = Observer(manager);
			const { port } = observer.address();
			const EXECUTION_ENV =  Object.assign({}, process.env, {
				OBSERVER_PORT: port,
				OBSERVER_HOST: '127.0.0.1',
			});

			examiner.executor(ID.EXECUTOR, async function BaseLocalExecutor(agent, execution) {
				const dir = path.join(temp.path, Math.random().toString(16).substr(2, 8));

				await execution.$update({ status: 0 });

				try {
					await fs.ensureDir(dir);
					await unzip(await agent.fetch(), dir);
				} catch (err) {
					return await execution.$update({ error: err.message });
				}
				
				await execution.$update({ status: 1 });

				try {
					await new Promise((resolve, reject) => {
						const installing = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', [
							'install'
						], { cwd: dir });
		
						installing
							.on('error', err => reject(err))
							.on('close', code => resolve());
					});
				} catch(err) {
					return await execution.$update({ error: err.message });
				}

				await execution.$update({ status: 2 });
				
				const sessionId = manager.create(execution);
				spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', [
					'mocha',
					'--reporter',
					'@or-change/tdk/reporter',
					'--require',
					path.join(__dirname, 'log.js')
				], {
					cwd: dir,
					env: Object.assign({
						EXECUTION_SESSION: sessionId
					}, EXECUTION_ENV)
				}).on('close', () => {
					manager.destroy(sessionId);
					fs.remove(dir);
				});
			});

			examiner.router(function install(router, { Model, scanner, Tester }) {
				router.post('/com.oc.basic/source/:sourceId/agent', async ctx => {
					const { sourceId } = ctx.params;
					const { files } = ctx.request;

					if (files === undefined || !files.source || Array.isArray(files.source)) {
						return ctx.throw(400);
					}

					const fileOptions = files.source;
					const source = await Model.Source.query({ sourceId });
					
					if (!source || source.status !== 0 || source.agent !== ID.SOURCE_AGENT) {
						return ctx.throw(412, 'Bad source state.');
					}

					try {
						sourceBufferStore[sourceId] = await fs.readFile(fileOptions.path);
						await source.$update({ status: 1 });

						const agent = new Tester.SourceAgent[ID.SOURCE_AGENT](sourceId);
	
						scanner.parse(agent, source);
						ctx.body = 'ok';
					} catch (error) {
						await source.$update({error: error.message});
						ctx.throw(417, 'Setting failed.');
					} 

				}).post('/com.oc.basic/execution/:executionId/executor', async ctx => {
					const { executionId } = ctx.params;
					const execution = await Model.Execution.query({ executionId });

					if (!execution || execution.status !== -1 || execution.executor !== ID.EXECUTOR) {
						return ctx.throw(412, 'Bad execution state.');
					}

					const agent = new Tester.SourceAgent[ID.SOURCE_AGENT](execution.sourceId);

					Tester.Executor[execution.executor](agent, execution).catch(err => {
						execution.$update({ error: err.message });
					});
					ctx.body = 'ok';
				});
			});

			examiner.sourceAgent(ID.SOURCE_AGENT, function BasicLocalSourceAgent(sourceId) {
				return {
					async fetch() {
						return sourceBufferStore[sourceId];
					}
				};
			});
	
			examiner.entry(path.join(__dirname, 'app/index.js'));
		}
	};
};