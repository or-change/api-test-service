<template>
	<div>
			<h6 class="font-weight-bold">源代码列表</h6>
			<div>
				<label for="keyword" class="align-middle mb-0">关键字搜索：</label>
				<b-form-input
					id="keyword" size="sm" class="d-inline-block align-middle mr-3" style="width: 10em"
					v-model="keyword"
					placeholder="输入搜索关键字"
				></b-form-input>
				<b-button size="sm" variant="primary" v-b-modal.upload-source>创建源代码</b-button>
				<b-button size="sm" variant="danger" @click="$emit('delete')" class="float-right">删除</b-button>
				<b-pagination
					size="sm" class="float-right mr-3 mb-0"
					:total-rows="totalRow" :per-page="perPage"
					v-model="currentPage"
				/>
			</div>

			<b-table
				ref="sourceList" class="mt-3"
				:fields="[
					{ label: '', key: 'select', class: 'select' },
					{ label: '版本号', key: 'semver' },
					{ label: '状态', key: 'status' },
					{ label: '错误', key: 'error' },
					{ label: '代理', key: 'agent', class: 'col-130', },
					{ label: '创建时间', key: 'createdAt', class: 'col-130', sortable: true },
					{ label: '', key: 'download' }
				]"
				:items="sourceList"
				sort-by="createdAt" :sort-desc="true"
				:per-page="perPage" :current-page="currentPage"
				:filter="keyword" :filter-function="filter" @filtered="onFiltered"
			>
				<template slot="HEAD[select]">
					<b-checkbox :checked="totalRow && totalRow === selectedSourceList.length"
						:disabled="disabledSelectAll"
						:class="{ 'show': totalRow && totalRow === selectedSourceList.length }"
						@change="selectAll" />
				</template>
				<template slot="[select]" slot-scope="data">
					<b-checkbox :checked="selectedSourceList.indexOf(data.item.id) !== -1"
						:disabled="data.item.status !== 5 && !data.item.error"
						:class="{ 'show': selectedSourceList.indexOf(data.item.id) !== -1 }"
						@change="selectOne($event, data.item.id)" />
				</template>

				<template slot="[semver]" slot-scope="data">
					<b-link class="text-truncate d-inline-block w-100" :disabled="data.item.status !== 5" :title="data.value"
						:to="`/workbench/project/${projectId}/source/${data.item.id}`">{{ data.value }}</b-link>
				</template>
				<template slot="[status]" slot-scope="data">
					{{ data.value | statusFormat }}
				</template>
				<template slot="[error]" slot-scope="data">
					<b-button
						variant="outline-primary" class="border-0 bg-transparent py-0 align-top shadow-none" size="sm"
						@click="showError(data.value)"
					>
						<i :class="data.item | statusIcon" />
					</b-button>
				</template>
				<template slot="[agent]" slot-scope="data">
					{{ data.value | agentFormat($product) }}
				</template>
				<template slot="[createdAt]" slot-scope="data">
					{{ data.value | dateFormat  }}
				</template>
				<template slot="[download]" slot-scope="data">
						<b-link :disabled="data.item.status !== 5 && !data.item.error"
							:href="`/api/project/${projectId}/source/${data.item.id}/pack`">
							<i class="fas fa-cloud-download-alt"></i>
						</b-link>
				</template>
			</b-table>
		</div>
</template>

<script>
const STATUS = {
	'0': '正在配置',
	'1': '配置完毕',
	'2': '正在解压',
	'3': '下载依赖',
	'4': '正在扫描',
	'5': '结束'
};

export default {
	data() {
		return {
			selectedSourceList: [],
			totalRow: 0,
			perPage: 10,
			currentPage: 1,
			keyword: '',
			disabledSelectAll: false,
		}
	},
	watch:{
		keyword() {
			this.$nextTick(() => {
				this.setDisabled();
			});
		},
		sourceList() {
			this.totalRow = this.sourceList.length;
			this.keyword = '';

			this.$nextTick(() => {
				this.setDisabled();
			});
		}
	},
	props: {
		sourceList: {
			default: []
		},
		projectId: {
			default: ''
		}
	},
	filters: {
		agentFormat(value, product) {
			return product.source[value] ? product.source[value].name : value; 
		},
		statusFormat(value) {
			return STATUS[value];
		},
		statusIcon(value) {
			if (value.error) {
				return 'text-danger fas fa-exclamation-circle';
			}

			if (value.status < 5) {
				return 'text-secondary fas fa-question-circle';
			}

			if (value.status === 5) {
				return 'text-success fas fa-check-circle';
			}
		}
	},
	methods: {
		selectAll(checked) {
			if (!checked) {
				return this.selectedSourceList = [];
			}
			return this.selectedSourceList = this.$refs.sourceList.filteredItems
				.filter((source) => source.status === 5 || source.error).map(source => source.id);
		},
		selectOne(checked, id) {
			const index = this.selectedSourceList.indexOf(id);

			if (index === -1) {
				return this.selectedSourceList.push(id);
			}
			return this.selectedSourceList.splice(index, 1);
		},
		onFiltered(filteredItems) {
			this.totalRow = filteredItems.length;
      this.currentPage = 1;
		},
		setDisabled() {
			console.log(this.$refs.sourceList.filteredItems.filter(source => source.status !== 5 && !source.error), this.$refs.sourceList.filteredItems.length)
			this.disabledSelectAll = this.$refs.sourceList.filteredItems.filter(source => source.status !== 5 && !source.error).length === this.$refs.sourceList.filteredItems.length;
		},
		filter(item, keyword) {
			const regExp = new RegExp(keyword);

			return regExp.test(item.semver)
				|| regExp.test(this.$options.filters.statusFormat(item.status))
				|| regExp.test(this.$options.filters.agentFormat(item.agent, this.$product));
		}
	}
}
</script>