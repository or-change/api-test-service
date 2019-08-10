const path = require('path');
const fs = require('fs');
const koa = require('koa');
const koaBody = require('koa-body');
const Router = require('koa-router');
const { spawn } = require('child_process');
const yauzl = require('yauzl');

const TIMEOUT = 15 * 60 * 1000;
const ID = {
	SOURCE_AGENT: 'basic.local',
	EXECUTOR: 'basic.local'
};

module.exports = function BasicSuitePluginProvider() {
	const store = {};

	return {
		name: 'Examiner Basic Plugin Suite',
		id: 'com.oc.basic',
		version: '1.0.0',
		description: 'Basic functions for getting started.',
		install: function BasicSuitePluginInstall(examiner, { temp }) {
			const Session = {
				store: {},
				create(scan) {
					const id = Math.random().toString(16).substr(2, 8);
					
					return new Promise((resolve, reject) => {
						scan(id, reject);
		
						const execution = this.store[id] = {
							callback() {
								resolve(execution);
							},
							timer: setTimeout(() => reject(), TIMEOUT)
						};
					}).finally(() => {
						clearTimeout(this.store[id].timer);
						delete this.store[id];
					});
				}
			};
			const router = new Router({
				prefix: '/:sessionId'
			}).post('/log', ctx => {
			
			}).post('/structure', ctx => {

			}).get('/progress', ctx => {
			
			});
			const observer = new koa().use(koaBody()).use(router.routes()).listen();
			const { port } = observer.address();
			const EXECUTION_ENV =  Object.assign({}, process.env, {
				TDK_MODE: 'scan',
				OBSERVER_PORT: port,
				OBSERVER_HOST: '127.0.0.1',
			});

			examiner.executor(ID.EXECUTOR, async function BaseLocalExecutor(agent, execution) {
				const sourceBuffer = await agent.fetch();
				const dir = path.join(temp.path, Math.random().toString(16).substr(2, 8));

				await fs.ensureDir(dir);
				await new Promise((resolve, reject) => {
					yauzl.fromBuffer(sourceBuffer, {
						lazyEntries: true
					}, (err, zipfile) => {
						if (err) {
							return reject(err);
						}

						zipfile.on('entry', async entry => {
							if (/\/$/.test(entry.fileName)) {
								await fs.ensureDir(path.join(dir, entry.fileName));
								zipfile.readEntry();
							} else {
								zipfile.openReadStream(entry, function (err, readStream) {
									if (err) {
										return reject(err);
									}

									readStream.on('end', function () {
										zipfile.readEntry();
									}).pipe(fs.createWriteStream(path.join(dir, entry.fileName)));
								});
							}
						}).on('end', () => resolve());

						zipfile.readEntry();
					});
				});

				await new Promise((resolve, reject) => {
					const installing = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', [
						'install'
					], {
						cwd: dir,
					});
	
					installing
						.on('error', err => reject(err))
						.on('close', code => resolve());
				});
				
				await Session.create((sessionId, reject) => {
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
					}).on('error', err => {
						reject(err);
					});
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
					
					if (!source || source.initialized || source.agent !== ID.SOURCE_AGENT) {
						return ctx.throw(412, 'Bad source state.');
					}

					store[sourceId] = await fs.readFile(fileOptions.path);

					const agent = new Tester.SourceAgent[ID.SOURCE_AGENT](sourceId);

					scanner.parse(agent, source);
					ctx.body = 'ok';
				}).post('/com.oc.basic/execution/:executionId/executor', async ctx => {
					const { executionId } = ctx.params;
					const execution = await Model.Execution.query({ executionId });

					if (!execution || execution.status !== -1 || execution.executor !== ID.EXECUTOR) {
						return ctx.throw(412, 'Bad execution state.');
					}

					const agent = new Tester.SourceAgent[ID.SOURCE_AGENT](execution.sourceId);

					Tester.Executor[execution.executor](agent, execution);
					ctx.body = 'ok';
				});
			});

			examiner.sourceAgent(ID.SOURCE_AGENT, function BasicLocalSourceAgent(sourceId) {
				return {
					async fetch() {
						return store[sourceId];
					}
				};
			});
	
			examiner.entry(path.join(__dirname, 'app/index.js'));
		}
	};
};