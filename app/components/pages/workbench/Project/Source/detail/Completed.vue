<template>
	<div>
		<div>
			<label for="keyword" class="align-middle mb-0">搜索关键字：</label>
			<b-form-input
				id="keyword" size="sm" class="d-inline-block align-middle mr-3" style="width: 15em"
				v-model="keyword"
				placeholder="输入查找关键字"
			></b-form-input>
			<b-button size="sm" variant="danger" @click="deleteExecution" class="float-right">删除</b-button>
			<b-pagination
				size="sm" class="float-right mr-3 mb-0"
				:total-rows="totalRow" :per-page="perPage"
				v-model="currentPage"
			/>
		</div>

		<b-table
			ref="completedList" class="mt-3"
			:fields="[
				{ label: '', key: 'select', class: 'select' },
				{ label: '标识', key: 'id', class: 'col-100' },
				{ label: '通过率', key: 'passRate', class: ['col-200'] },
				{	label: '报告', key: 'reporter', class: ['text-center', 'col-90'] },
				{ label: '执行器', key: 'executor', class: 'col-100' },
				{ label: '创建时间', key: 'createdAt', class: 'col-130', sortable: true },
				{ label: '结束时间', key: 'endedAt', class: 'col-130' }
			]"
			:items="items"
			sort-by="createdAt" :sort-desc="true"
			:per-page="perPage" :current-page="currentPage"
			:filter="keyword" :filter-function="filter" @filtered="onFiltered"
			@row-dblclicked="(item) => { $emit('select', item) }"
		>
			<template slot="HEAD[select]">
				<b-checkbox :checked="totalRow && totalRow === selected.length"
					:class="{ 'show': totalRow && totalRow === selected.length }"
					@change="selectAll" />
			</template>
			<template slot="[select]" slot-scope="data">
				<b-checkbox :checked="selected.indexOf(data.item.id) !== -1"
					:class="{ 'show': selected.indexOf(data.item.id) !== -1 }"
					@change="selectOne($event, data.item.id)" />
			</template>

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
		</b-table>
	</div>
</template>

<script>
import mixin from './mixin';

export default {
	mixins: [mixin],
	data() {
		return {
			selected: [],
			keyword: ''
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
		selectAll(checked) {
			if (!checked) {
				return this.selected = [];
			}
			return this.selected = this.$refs.completedList.filteredItems.map(source => source.id);
		},
		selectOne(checked, id) {
			const index = this.selected.indexOf(id);

			if (index === -1) {
				return this.selected.push(id);
			}
			return this.selected.splice(index, 1);
		},
		filter(item, keyword) {
			return new RegExp(keyword).test(this.$options.filters.executorFilter(item.executor))
				|| keyword === `${item.passRate * 100}%`;
		}
	}
}
</script>