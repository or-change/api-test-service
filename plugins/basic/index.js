const path = require('path');
const fs = require('fs-extra');
const meta = require('./meta.json');
const Observer = require('./src/components/executor/observer');
const Manager = require('./src/dispatcher');
const spawn = {
	installing: require('./src/components/process/install'),
	running: require('./src/components/process/run')
};

const ID = {
	SOURCE_AGENT: 'ecma.mocha.basic.local',
	EXECUTOR: 'ecma.mocha.basic.local'
};

module.exports = function BasicSuitePluginProvider() {
	const sourceBufferStore = {};

	return Object.assign({}, meta, {
		install: function BasicSuitePluginInstall(examiner, { temp, utils, Model, Registry }) {
			const Tester = Registry.Tester();
			const manager = Manager();
			const observer = Observer(manager);
			const { port } = observer.address();

			examiner.executor(ID.EXECUTOR, async function BaseLocalExecutor(agent, execution) {
				await execution.$update({ status: 0 });

				const dirname = path.join(temp.path, Math.random().toString(16).substr(2, 8));

				try {
					await fs.ensureDir(dirname);
					await utils.unzip(await agent.fetch(), dirname);
				} catch (err) {
					return await execution.$update({ error: err.message });
				}
				
				await execution.$update({ status: 1 });

				try {
					await spawn.installing(dirname);
					
					const sessionId = manager.create(execution);

					await spawn.running();
					manager.destroy(sessionId);
					fs.remove(dirname);
				} catch(error) {
					return await execution.$update({ error: error.message });
				}

				await execution.$update({ status: 2 });
			});

			examiner.router(function install(router) {
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
	});
};