<template>
	<div>
		<f-row style="position: relative" class="ms-my-2">
			<f-col col="2">
				<f-label>执行状态</f-label>
				<f-dropdown
					:options="options"
					placeholder="选择执行状态"
					v-model="filter.status"
					multi-select
				/>
			</f-col>
			<div class="button-group">
				<f-button
					class="button-danger"
					text="删除"
					variant="primary"
					:disabled="selected.length === 0"
					@click="deleteExecution()"
				/>
			</div>
		</f-row>

		<custom-list
			:fields="[
				{ label: 'ID', key: 'id', class: 'ms-w-auto' },
				{ label: 'Status', key: 'status' },
				{ label: 'Error', key: 'error' },
				{ label: 'Executor', key: 'executor' },
				{ label: 'CreatedAt', key: 'createdAt', class: 'col-130' }
			]"
			:items="filteredExecution"
			:select-mode="filteredExecution.length !== 0 ? 'multi' : 'single'"
			v-model="selected"
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
				status: []
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
				return this.filter.status.length ? this.filter.status.indexOf(execution.status) !== -1 : true;
			});
		}
	}
}
</script>

