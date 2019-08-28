<template>
	<div>
		<div>
			<label for="keyword" class="align-middle mb-0">搜索关键字：</label>
			<b-form-input
				id="keyword" size="sm" class="d-inline-block align-middle mr-3" style="width: 15em"
				v-model="keyword"
				placeholder="输入查找关键字"
			></b-form-input>
			<b-button size="sm" variant="danger" :disabled="selected.length === 0"
				@click="deleteExecution" class="float-right">删除</b-button>
			<b-pagination
				size="sm" class="float-right mr-3 mb-0"
				:total-rows="totalRow" :per-page="perPage"
				v-model="currentPage"
			/>
		</div>

		<custom-table
			ref="completedList" class="mt-3"
			:fields="[
				{ label: '标识', key: 'id', class: 'col-100' },
				{ label: '通过率', key: 'passRate', class: ['col-200'] },
				{	label: '报告', key: 'reporter', class: ['text-center', 'col-90'] },
				{ label: '执行器', key: 'executor', class: 'col-100' },
				{ label: '创建时间', key: 'createdAt', class: 'col-130', sortable: true },
				{ label: '结束时间', key: 'endedAt', class: 'col-130' }
			]"
			:items="items" :selectable="true"
			sort-by="createdAt" :sort-desc="true"
			:per-page="perPage" :current-page="currentPage"
			:filter="keyword" :filter-function="filter" @filtered="onFiltered"
			@row-dblclicked="(item) => { $emit('select', item) }"
			v-model="selected"
		>
			<template slot="[passRate]" slot-scope="data">
				<b-progress
					height="2px" :value="data.value"
					class="d-inline-block align-middle w-75"
				/>
				<span class="float-right">{{ `${Math.round(data.value * 100)}%` }}</span>
			</template>
			<template slot="[executor]" slot-scope="data">
				{{ data.value | executorFilter($product) }}
			</template>
			<template slot="[createdAt]" slot-scope="data">
				{{ data.value | dateFormat }}
			</template>
			<template slot="[endedAt]" slot-scope="data">
				{{ data.value | dateFormat }}
			</template>
			<template slot="[reporter]" slot-scope="data">
				<b-link title="查看在线报告"
					:href="`#/workbench/project/${projectId}/source/${sourceId}/execution/${data.item.id}/reporter`">
					<i class="fas fa-sticky-note" />
				</b-link>
			</template>
		</custom-table>
	</div>
</template>

<script>
import mixin from './mixin';

export default {
	mixins: [mixin],
	data() {
		return {
			selected: []
		}
	},
	props: {
		projectId: {
			default: null
		},
		sourceId: {
			default: null
		}
	},
	methods: {
		filter(item, keyword) {
			return new RegExp(keyword).test(this.$options.filters.executorFilter(item.executor, this.$product))
				|| keyword === `${item.passRate * 100}%`;
		}
	}
}
</script>