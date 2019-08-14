<template>
	<div>
		<f-row style="position: relative" class="ms-my-2">
			<f-col col="2">
				<f-label>进度</f-label>
				<f-dropdown
					:options="options"
					placeholder="选择执行进度"
					v-model="filter.progress"
				/>
			</f-col>
			<f-col col="2" class="ms-ml-2">
				<f-label>执行状态</f-label>
				<f-dropdown
					:options="status"
					placeholder="选择执行状态"
					v-model="filter.status"
					multi-select
				/>
			</f-col>
		</f-row>

		<custom-list
			:fields="[
				{ label: '标识', key: 'id', class: 'ms-w-auto' },
				{ label: '进度', key: 'progress' },
				{ label: '状态', key: 'status' },
				{ label: '执行器', key: 'executor' },
				{ label: '创建时间', key: 'createdAt', class: 'col-130' }
			]"
			:items="filteredExecution"
		>
			<template slot="row-progress" slot-scope="item">
				<f-row>
					<f-col col="9">
						<f-progress
							:data="{
								value: item.value.progress * 100,
								variant: 'success'
							}" size="lg"
							style="margin: 20px 0;"
						/>
					</f-col>
					<f-col col="3" class="ms-center">
						{{`${item.value.progress * 100}%`}}
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
	</div>
</template>

<script>
import mixin from './mixin'

export default {
	data() {
		return {
			filter: {
				progress: '',
				status: []
			}
		}
	},
	mixins: [mixin],
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
				const { progress, status } = this.filter;

				const progressFilter = progress ? execution.progress >= progress : true;
				const statusFilter = status.length ? status.indexOf(execution.status) !== -1 : true;

				return progressFilter && statusFilter;
			});
		}
	}
}
</script>

