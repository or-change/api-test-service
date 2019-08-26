<template>
	<div>
		<div>
			<label for="keyword" class="align-middle mb-0">搜索关键字：</label>
			<b-form-input
				id="keyword" size="sm" class="d-inline-block align-middle mr-3" style="width: 15em"
				v-model="keyword"
				placeholder="输入查找关键字"
			></b-form-input>
			<b-pagination
				size="sm" class="float-right mr-3 mb-0"
				:total-rows="totalRow" :per-page="perPage"
				v-model="currentPage"
			/>
		</div>
		<b-table
			ref="unfinishedList" class="mt-3"
			:fields="[
				{ label: '标识', key: 'id', class: 'col-100' },
				{ label: '进度', key: 'progress' },
				{ label: '状态', key: 'status', class: 'col-100' },
				{ label: '执行器', key: 'executor', class: 'col-100' },
				{ label: '创建时间', key: 'createdAt', class: 'col-130', sortable: true }
			]"
			:items="items"
			sort-by="createdAt" :sort-desc="true"
			:per-page="perPage" :current-page="currentPage"
			:filter="keyword" :filter-function="filter" @filtered="onFiltered"
		>
			<template slot="[progress]" slot-scope="data">
				<b-progress
					height="2px" :value="data.value" variant='success'
					class="d-inline-block align-middle w-75"
				/>
				<span class="pl-4">{{ `${Math.round(data.value * 100)}%` }}</span>
			</template>
			<template slot="[status]" slot-scope="data">
				{{ data.value | statusFilter }}
			</template>
			<template slot="[executor]" slot-scope="data">
				{{ data.value | executorFilter($product) }}
			</template>
			<template slot="[createdAt]" slot-scope="data">
				{{ data.value | dateFormat }}
			</template>
		</b-table>
	</div>
</template>

<script>
import mixin from './mixin'

export default {
	data() {
		return {
			keyword: ''
		}
	},
	mixins: [mixin],
	methods: {
		filter(item, keyword) {
			return new RegExp(keyword).test(this.$options.filters.executorFilter(item.executor))
				||	new RegExp(keyword).test(this.$options.filters.statusFilter(item.status))
				|| keyword === `${item.progress * 100}%`;
		}
	}
}
</script>

