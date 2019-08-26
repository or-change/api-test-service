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
			ref="abnormalList" class="mt-3"
			:fields="[
				{ label: '', key: 'select', class: 'select' },
				{ label: '标识', key: 'id', class: 'col-100' },
				{ label: '状态', key: 'status' },
				{ label: '错误', key: 'error' },
				{ label: '执行器', key: 'executor' },
				{ label: '创建时间', key: 'createdAt', class: 'col-130' }
			]"
		>
			<template slot="[status]" slot-scope="data">
				{{ data.value | statusFilter }}
			</template>
			<template slot="[error]" slot-scope="data">
				<b-button
					variant="outline-primary" class="border-0 bg-transparent py-0 align-top shadow-none" size="sm"
					@click="showError(data.value)"
				>
					<i class="text-danger fas fa-exclamation-circle" />
				</b-button>
			</template>
			<template slot="[executor]" slot-scope="data">
				{{ data.value | executorFilter($product) }}
			</template>
			<template slot="[createdAt]" slot-scope="data">
				{{ data.value | dateFormat }}
			</template>
		</b-table>
		
		<b-modal
			ref="show-error" size="md" title="错误信息" centered ok-only
			button-size="sm" ok-title="确定"
		>
			<textarea rows="10" readonly :value="error" style="width: 100%"></textarea>
		</b-modal>
	</div>
</template>

<script>
import mixin from './mixin';

export default {
	mixins: [mixin],
	data() {
		return {
			selected: [],
			keyword: '',
			error: ''
		}
	},
	methods: {
		filter(item, keyword) {
			return new RegExp(keyword).test(this.$options.filters.executorFilter(item.executor))
				||	new RegExp(keyword).test(this.$options.filters.statusFilter(item.status));
		},
		showError(error) {
			this.error = error;
			this.$refs['show-error'].show();
		}
	}
}
</script>

