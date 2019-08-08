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

					<template slot="row-avaliable" slot-scope="props">
						<i
							class="success ms-Icon ms-Icon--CompletedSolid"
							v-show="props.value.avaliable"></i>
						<i
							class="fail ms-Icon ms-Icon--ErrorBadge"
							v-show="!props.value.avaliable"></i>
					</template>

					<template slot="row-download" slot-scope="props">
						<f-button
							id="download"
							icon="ms-Icon ms-Icon--CloudDownload"
							:border="false"
							:disabled="!props.value.avaliable"
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
					v-model="project.name" />
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
		</custom-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			project: {
				name: ''
			},
			sourceList: [],
			source: {
				semver: ''
			},
			selectedSourceList: [],
			show: false,
			filter: {
				semver: []
			},
			fields: [
				{
					label: 'Semver',
					key: 'semver'
				},
				{
					label: 'Avaliable',
					key: 'avaliable'
				},
				{
					label: 'Agent',
					key: 'agent'
				},
				{
					label: 'CreatedAt',
					key: 'createdAt'
				},
				{
					label: '',
					key: 'download'
				}
			]
		}
	},
	watch:{
		show() {
			if (!this.show) {
				this.source.semver = '';
			}
		}
	},
	computed: {
		projectId() {
			return this.$route.params.projectId;
		},
		projectName() {
			return this.project.name;
		},
		filteredSourceList() {
			let filteredSourceList = this.sourceList;
				
			if (this.filter.semver && this.filter.semver.length !== 0) {
				filteredSourceList = filteredSourceList
					.filter(source => this.filter.semver.indexOf(source.semver) !== -1);
			}
			
			return filteredSourceList.sort((a, b) => {
				return b.createdAt - a.createdAt;
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
		async getProject() {
			this.project = await this.$http.project.get(this.projectId);
		},
		async updateProject() {
			await this.$http.project.update(this.projectId, {
				name: this.project.name
			});
			
			await this.getProject();
		},
		async uploadSource() {
			await this.$http.project.source(this.projectId).create(this.source)
			
			await	this.getSourceList();
		},
		async deleteSource() {
			await Promise.all(this.selectedSourceList.map(source => {
				return this.$http.project.source(this.projectId).delete(source.id);
			}));

			await this.getSourceList();
			this.selectedSourceList = [];
		},
		async getSourceList() {
			this.sourceList = await this.$http.project.source(this.projectId).query();
		},
		downloadSource() {

		}
	},
	mounted() {
		this.getProject();
		this.getSourceList();
	}
}
</script>
