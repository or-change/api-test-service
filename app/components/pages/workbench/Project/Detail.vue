<template>
	<div
		id="project-detail"
	>
		<custom-breadcrumb
			:items="[
				{
					text: '我的项目',
					href: '#/workbench/project'
				},
				{
					text: project ? projectName : `项目: ${projectId}`,
					href: `#/workbench/project/${projectId}`
				}
			]"
			/>

		<f-row>
			<f-col col="9">
				<f-label size="lg" class="ms-mb-2">项目源代码列表</f-label>
				<f-row class="ms-mb-2" style="position: relative">
					<div class="button-group">
						<f-button
							class="button-danger"
							text="删除"
							variant="primary"
							:disabled="!selectedSourceList || selectedSourceList.length === 0"
							@click="deleteSource"
						/>
					</div>
					<f-col col="2" sm="4" md="4" lg="2">
						<f-dropdown
							:options="semverList"
							placeholder="选择源代码版本"
							v-model="filter.semver"
							multi-select
						/>
					</f-col>
					<f-button 
						text="上传"
						variant="primary"
						@click="show = true"
						class="ms-ml-3"
					/>
				</f-row>

				<custom-list
						:fields="fields"
						:items="filteredSourceList"
						:select-mode="filteredSourceList.length !== 0 ? 'multi' : 'single'"
						v-model="selectedSourceList"
				>
					<template slot="row-semver" slot-scope="props">
						<f-link
							:href="`#/workbench/project/${projectId}/source/${props.value.id}`"
						>{{props.value.semver}}</f-link>
					</template>

					<template slot="row-state" slot-scope="props">
						<i
							class="success ms-Icon ms-Icon--CompletedSolid"
							v-show="props.value.state"></i>
						<i
							class="fail ms-Icon ms-Icon--ErrorBadge"
							v-show="!props.value.state"></i>
					</template>

					<template slot="row-download" slot-scope="props">
						<f-button
							id="download"
							icon="ms-Icon ms-Icon--DrillDownSolid"
							:border="false"
							@click="downloadSource"
						/>
					</template>
				</custom-list>
			</f-col>
			<f-col col="3" class="ms-pl-3">
				<f-label size="lg" class="ms-mb-2">项目信息</f-label>
				<f-text-field
					label="项目名称"
					placeholder="输入项目名称"
					underline
					@focus="resetMessage"
					v-model="project.name" />
				<f-text-field
					class="ms-mt-3"
					label="项目负责人"
					underline
					readonly
					v-model="project.owner.name" />
				<!-- <f-text-field
					class="ms-mt-3"
					label="项目参与者"
					underline
					readonly
					v-model="collaborators" /> -->
				<f-text-field
					class="ms-mt-3"
					label="创建时间"
					underline
					readonly
					v-model="project.createdAt" />
				<f-button
					class="ms-mt-3"
					text="更新"
					variant="primary"
					@click="updateProject"
				/>

				<!-- <f-button
					class="button-danger"
					text="删除"
					variant="primary"
					@click="deleteProject"
				/> -->

				<f-label
					:class="[
						'ms-mt-1',
						'ms-ml-3',
						message.state
					]"
					style="display: inline-block; vertical-align: baseline"
				>
					{{ message.content }}
				</f-label>
			</f-col>
		</f-row>
		<custom-dialog
			id="create-source"
			v-model="show" 
			title="上传项目源代码"
			ok-text="上传"
			@ok="uploadSource"
		>
			<f-text-field
				label="源代码"
				placeholder="github"
				underline
				v-model="source.semver"
			/>
			<f-label
				v-show="fail"
				style="color: red"
				class="ms-pt-3"
			>
				上传失败！
			</f-label>
		</custom-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			projectName: null,
			project: {
				name: '',
				owner: {
					name: '无'
				},
				// collaborators: []
			},
			sourceList: [],
			source: {
				semver: ''
			},
			sourcePlugin: null,
			selectedSourceList: [],
			show: false,
			fail: false,
			filter: {
				semver: []
			},
			fields: [
				{
					label: 'Semver',
					key: 'semver'
				},
				{
					label: 'State',
					key: 'state'
				},
				{
					label: 'CreatedAt',
					key: 'createdAt'
				},
				{
					label: 'Download',
					key: 'download'
				}
			]
		}
	},
	watch:{
		show() {
			if (!this.show) {
				this.source.semver = '';
				this.fail = false;
			}
		}
	},
	computed: {
		projectId() {
			return this.$route.params.projectId;
		},
		// collaborators() {
		// 	return this.project.collaborators
		// 		.map(collaborator => collaborator.name)
		// 		.join(' ');
		// },
		filteredSourceList() {
			let filteredSourceList = this.sourceList;
				
			if (this.filter.semver && this.filter.semver.length !== 0) {
				filteredSourceList = filteredSourceList
					.filter(source => this.filter.semver.indexOf(source.semver) !== -1);
			}
			
			return filteredSourceList.map(source => {
				return {
					id: source.id,
					semver: source.semver,
					state: source.structure ? true : false,
					createdAt: source.createdAt
				};
			}).sort((a, b) => {
				return new Date(b.createdAt) - new Date(a.createdAt);
			});
		},
		semverList() {
			const semverList = [];
			const result = [];

			this.sourceList.map(source =>  {
				return source.semver;
			}).forEach((semver) => {
				if (semverList.indexOf(semver) === -1) {
					semverList.push(semver);
					result.push({text: semver, value: semver});
				}
			});

			return result;
		}
	},
	methods: {
		getProject() {
			this.$http.project.get(this.projectId)
				.then(res => {
					this.project = res.data;
					this.projectName = res.data.name;
				})
		},
		updateProject() {
			this.resetMessage();

			return this.$http.project.update(this.projectId, {
				name: this.project.name
			})
				.then(() => {
					this.setMessage('success', '项目更新成功！');
				}).catch(() => {
					this.setMessage('fail', '项目更新失败！');
				});
		},
		// deleteProject() {
		// 	this.resetMessage();

		// 	return this.$http.project.delete(this.projectId)
		// 		.then(() => {
		// 			this.$router.push('#/workbench/project');
		// 		}).catch(() => {
		// 			this.setMessage('fail', '项目删除失败！');
		// 		});
		// },
		uploadSource() {
			this.fail = false;

			return this.sourcePlugin.create(this.source)
				.then(() => {
					this.getSourceList();
				})
				.catch(() => {
					this.fail = true;
				});
		},
		deleteSource() {
			Promise.all(this.selectedSourceList.map(source => {
				return this.sourcePlugin.delete(source.id);
			})).then(() => {
				this.getSourceList();
				this.selectedSourceList = [];
			});
		},
		getSourceList() {
			this.sourcePlugin.query()
				.then((res) => {
					this.sourceList = res.data;
				});
		},
		downloadSource() {

		}
	},
	mounted() {
		this.sourcePlugin = this.$http.project.source(this.projectId);

		this.getProject();
		this.getSourceList();
	}
}
</script>

<style lang="scss">
.fail {
	color: red;
}

.success {
	color: green;
}

#download {
	height: 100%;

	.ms-button {
		background-color: transparent;
		height: 100%;
	}
}

#project-detail {
	i {
		font-size: 16px;
	}
}
</style>
