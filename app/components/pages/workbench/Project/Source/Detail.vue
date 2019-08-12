<template>
	<div id="execution-container">
		<custom-breadcrumb
			:items="[
				{
					text: '我的项目',
					href: '#/workbench/project'
				},
				{
					text: projectName ? projectName : projectId,
					href: `#/workbench/project/${projectId}`
				},
				{
					text: '源代码',
					href: `#/workbench/project/${projectId}`
				},
				{
					text: source.semver,
					href: `#/workbench/project/${projectId}/source/${sourceId}`
				}
			]"
			/>

		<f-row>
			<f-col col="8">
				<f-label size="lg" class="ms-mb-2">执行列表</f-label>

				<f-row style="position: relative" class="ms-mb-2">
					<f-col col="2">
						<f-datepicker v-model="filter.createdAt" label="开始时间" overlaid size="sm" />
					</f-col>
					<f-col col="2" class="ms-ml-2">
						<f-label>执行器</f-label>
						<f-dropdown
							:options="executorOptions"
							placeholder="选择执行器"
							v-model="filter.executor"
							multi-select
						/>
					</f-col>
					<f-button 
						text="执行"
						variant="primary"
						@click="executionDialog = true"
						style="margin-top: 18px;"
						class="ms-ml-3"
					/>
				</f-row>

				<f-tabs v-model="type" type="link">
					<f-tab-item title="执行完成">
						<f-row style="position: relative" class="ms-my-2">
							<f-col col="2">
								<f-label>通过率</f-label>
								<f-dropdown
									:options="options"
									placeholder="选择执行通过率"
									v-model="completed.filter.passRate"
								/>
							</f-col>
							<div class="button-group">
								<f-button
									class="button-danger"
									text="删除"
									variant="primary"
									:disabled="completed.selected.length === 0"
									@click="deleteExecution(completed)"
								/>
							</div>
						</f-row>

						<custom-list
							:fields="completed.field"
							:items="filteredCompleted"
							:select-mode="filteredCompleted.length !== 0 ? 'multi' : 'single'"
							v-model="completed.selected"
						>
							<template slot="row-passRate" slot-scope="item">
								<f-row>
									<f-col col="9">
										<f-progress
											:data="{
												value: item.value.passRate,
												variant: 'primary'
											}" size="lg"
											style="margin: 20px 0;"
										/>
									</f-col>
									<f-col col="3" class="ms-center">
										{{`${item.value.passRate}%`}}
									</f-col>
								</f-row>
							</template>

							<template slot="row-id" slot-scope="item">
								<f-button
									:text="item.value.id"
									:border="false"
									title="查看执行摘要信息"
									@click="selectedExecution = item.value"
								/>
							</template>

							<template slot="row-executor" slot-scope="item">
								{{ item.value.executor | executorFilter($product) }}
							</template>

							<template slot="row-createdAt" slot-scope="item">
								{{ item.value.createdAt | dateFormat }}
							</template>

							<template slot="row-endedAt" slot-scope="item">
								{{ item.value.endedAt | dateFormat }}
							</template>

							<template slot="row-reporter" slot-scope="item">
								<f-button
									id="search-reporter-online"
									size="lg" tag="a"
									:border="false"
									icon="ms-Icon ms-Icon--CRMReport"
									:href="`#/workbench/project/${projectId}/source/${sourceId}/execution/${item.value.id}/reporter`"
									title="查看在线报告"
								/>
							</template>

							<!-- <template slot="row-download" slot-scope="item">
								<f-button
									size="lg"
									:border="false"
									icon="ms-Icon ms-Icon--DownloadDocument"
									@click="show = true; completed.downloadExecutionId = item.value.id"
									title="下载测试报告"
								/>
							</template> -->
						</custom-list>
					</f-tab-item>
					<f-tab-item title="未执行完成">
						<f-row style="position: relative" class="ms-my-2">
							<f-col col="2">
								<f-label>进度</f-label>
								<f-dropdown
									:options="options"
									placeholder="选择执行进度"
									v-model="unfinished.filter.progress"
								/>
							</f-col>
							<f-col col="2" class="ms-ml-2">
								<f-label>执行状态</f-label>
								<f-dropdown
									:options="statusOptions"
									placeholder="选择执行状态"
									v-model="unfinished.filter.status"
									multi-select
								/>
							</f-col>
						</f-row>

						<custom-list
							:fields="unfinished.field"
							:items="filteredUnfinished"
						>
							<template slot="row-progress" slot-scope="item">
								<f-row>
									<f-col col="9">
										<f-progress
											:data="{
												value: item.value.progress,
												variant: 'success'
											}" size="lg"
											style="margin: 20px 0;"
										/>
									</f-col>
									<f-col col="3" class="ms-center">
										{{`${item.value.progress}%`}}
									</f-col>
								</f-row>
							</template>

							<template slot="row-status" slot-scope="item">
								{{ item.value.status | statusFilter }}
							</template>

							<template slot="row-executor" slot-scope="item">
								{{ item.value.executor | executorFilter($product) }}
							</template>

							<template slot="row-createdAt" slot-scope="item">
								{{ item.value.createdAt | dateFormat }}
							</template>
						</custom-list>
					</f-tab-item>
					<f-tab-item title="异常执行">
						<f-row style="position: relative" class="ms-my-2">
							<f-col col="2">
								<f-label>执行状态</f-label>
								<f-dropdown
									:options="statusOptions"
									placeholder="选择执行状态"
									v-model="abnormal.filter.status"
									multi-select
								/>
							</f-col>
							<div class="button-group">
								<f-button
									class="button-danger"
									text="删除"
									variant="primary"
									:disabled="abnormal.selected.length === 0"
									@click="deleteExecution(abnormal)"
								/>
							</div>
						</f-row>

						<custom-list
							:fields="abnormal.field"
							:items="filteredAbnormal"
							:select-mode="filteredAbnormal.length !== 0 ? 'multi' : 'single'"
							v-model="abnormal.selected"
						>
							<template slot="row-status" slot-scope="item">
								{{ item.value.status | statusFilter }}
							</template>

							<template slot="row-executor" slot-scope="item">
								{{ item.value.executor | executorFilter($product) }}
							</template>

							<template slot="row-createdAt" slot-scope="item">
								{{ item.value.createdAt | dateFormat }}
							</template>
						</custom-list>
					</f-tab-item>
				</f-tabs>
			</f-col>
			<f-col col="4" class="ms-pl-3">
				<f-label size="lg" class="ms-mb-2">
					{{selectedExecution ? `执行结果：${selectedExecution.id}` : `源码摘要: 版本${source.semver}`}}
				</f-label>
				<div :style="{height: `${abstractHeight}px`}" id="abstract-container">
					<p
						v-for="(item, index) in abstract"
						:class="[item.type, 'ms-pb-1', 'ms-textTruncate']"
						:style="{'padding-left': `${25 * item.level}px`}"
						:title="item.title"
					>
						<span v-if="item.type === 'test'">
							<i
								class="default ms-Icon ms-Icon--UnknownSolid"
								v-show="!selectedExecution"></i>
							<i
								class="success ms-Icon ms-Icon--CompletedSolid"
								v-show="selectedExecution && !resultMapping[item.path.join('-')]"></i>

							<i
								class="fail ms-Icon ms-Icon--ErrorBadge"
								v-show="selectedExecution && resultMapping[item.path.join('-')]"></i>
						</span>
						<span>{{item.title}}</span>
					</p>
				</div>
			</f-col>
		</f-row>
		<custom-dialog
			id="start-execution"
			v-model="executionDialog" 
			title="开始执行"
			ok-text="执行"
			@ok="startExecution"
		>
			
			<div class="dropdown-container ms-mb-2">
				<f-label class="ms-d-inline-block ms-p-0 label-dropdown">执行器</f-label>
				<f-dropdown
					class="ms-d-inline-block"
					:options="executorOptions"
					placeholder="选择方式"
					v-model="execution.executor"
					style="width: 216px;"
				/>
			</div>

			<component
				ref="start-execution" :is="executor"
				@success="executionSuccess"
			></component>
		</custom-dialog>
		<custom-dialog
			id="get-reporter"
			v-model="show" 
			title="下载测试报告"
			ok-text="下载"
			@ok="downloadReporter"
		>
		</custom-dialog>
	</div>
</template>

<script>
import mixin from './action';

const statusMapping = {
	'-1': '空闲',
	'0': '拉取代码',
	'1': '安装',
	'2': '正在运行',
	'3': '结束'
};

export default {
	mixins: [mixin],
	filters: {
		statusFilter(value) {
			return statusMapping[value];
		},
		executorFilter(value, product) {
			return product.executor[value] ? product.executor[value].name : value;
		}
	},
	computed: {
		executorOptions() {
			const executorOptions = [];
			const { executor } = this.$product;

			for (let key in executor) {
				executorOptions.push({
					text:	executor[key].name,
					value: key
				})
			}

			this.execution.executor = executorOptions[0] ? executorOptions[0].value : '';

			return executorOptions;
		},
		statusOptions() {
			const statusValue = Object.keys(statusMapping);

			return statusValue.map(status => {
				return {
					value: Number(status),
					text: statusMapping[status]
				}
			});
		},
		executor() {
			const { executor } = this.$product;

			if (executor[this.execution.executor]) {
				return executor[this.execution.executor].create;
			}

			return '';
		},
		resultMapping() {
			const result = {};

			if (!this.selectedExecution) {
				return result;
			} else {
				this.selectedExecution.result.forEach(execution => {
					result[execution.join('-')] = true;
				});
			}

			return result;
		}
	}
}
</script>

<style lang="scss">
#abstract-container {
	p span {
		i, span {
			vertical-align: middle;
		}
	}
}
</style>

