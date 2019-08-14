<template>
	<div>
		<f-row style="position: relative" class="ms-my-2">
			<f-col col="2">
				<f-label>通过率</f-label>
				<f-dropdown
					:options="options"
					placeholder="选择执行通过率"
					v-model="filter.passRate"
				/>
			</f-col>
			<div class="button-group">
				<f-button
					class="button-danger"
					text="删除"
					variant="primary"
					:disabled="selected.length === 0"
					@click="deleteExecution"
				/>
			</div>
		</f-row>

		<custom-list
			:fields="[
				{ label: '标识', key: 'id', class: 'ms-w-auto' },
				{ label: '通过率', key: 'passRate' },
				{	label: '报告', key: 'reporter', class: 'col-90' },
				// { label: 'Download', key: 'download', class: 'col-90' },
				{ label: '执行器', key: 'executor', class: 'col-100' },
				{ label: '创建时间', key: 'createdAt', class: 'col-100' },
				{ label: '结束时间', key: 'endedAt', class: 'col-100' }
			]"
			:items="filteredExecution"
			:select-mode="filteredExecution.length !== 0 ? 'multi' : 'single'"
			v-model="selected"
		>
			<template slot="row-passRate" slot-scope="item">
				<f-row>
					<f-col col="9">
						<f-progress
							:data="{
								value: item.value.passRate * 100,
								variant: 'primary'
							}" size="lg"
							style="margin: 20px 0;"
						/>
					</f-col>
					<f-col col="3" class="ms-center">
						{{`${Math.round(item.value.passRate * 100)}%`}}
					</f-col>
				</f-row>
			</template>

			<template slot="row-id" slot-scope="item">
				<f-button
					:text="item.value.id"
					:border="false"
					title="查看执行摘要信息"
					@click="$emit('select', item.value)"
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
	</div>
</template>

<script>
import mixin from './mixin';

export default {
	mixins: [mixin],
	data() {
		return {
			selected: [],
			filter: {
				passRate: ''
			}
		}
	},
	props: {
		items: {
			type: Array,
			default: () => []
		},
		options: {
			type: Array,
			default: () => []
		}
	},
	computed: {
		filteredExecution() {
			return this.items.filter(execution => {
				return this.filter.passRate ? execution.passRate >= this.filter.passRate : true;
			});
		}
	}
}
</script>