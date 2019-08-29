<template>
	<div>
			<div>
				<label for="keyword" class="align-middle mb-0">关键字搜索：</label>
				<b-form-input
					id="keyword" size="sm" class="d-inline-block align-middle mr-3" style="width: 10em"
					v-model="keyword"
					placeholder="输入搜索关键字"
				></b-form-input>
				<b-button size="sm" variant="primary" v-b-modal.upload-source>创建源代码</b-button>
				<b-button size="sm" variant="danger" @click="$emit('delete')" class="float-right"
					:disabled="selectedSourceList.length === 0"
				>删除</b-button>
				<b-pagination
					size="sm" class="float-right mr-3 mb-0"
					:total-rows="totalRow" :per-page="perPage"
					v-model="currentPage"
				/>
			</div>

			<custom-table
				ref="sourceList" class="mt-3"
				:fields="[
					{ label: '版本号', key: 'semver' },
					{ label: '状态', key: 'status' },
					{ label: '错误', key: 'error' },
					{ label: '代理', key: 'agent', class: 'col-130', },
					{ label: '创建时间', key: 'createdAt', class: 'col-130', sortable: true },
					{ label: '', key: 'download' }
				]"
				:items="sourceList.map(source => {
					source.selectable = source.status !== 5 && !source.error ? false : true;
					return source;
				})"
				:selectable="true"
				sort-by="createdAt" :sort-desc="true"
				:per-page="perPage" :current-page="currentPage"
				:filter="keyword" :filter-function="filter" @filtered="onFiltered"
				v-model="selectedSourceList"
			>
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
					{{ data.value | agentFormat($product.source) }}
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
			</custom-table>

			<b-modal
				ref="show-error" size="md" title="错误信息" centered ok-only
				button-size="sm" ok-title="确定"
			>
				<textarea rows="10" readonly :value="error" style="width: 100%"></textarea>
			</b-modal>
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
			error: ''
		}
	},
	watch:{
		sourceList() {
			this.totalRow = this.sourceList.length;
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
		agentFormat(value, register) {
			return register[value] ? register[value].name : value; 
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
		showError(error) {
			if (error) {
				this.error = error;
				this.$refs['show-error'].show();
			}
		},
		onFiltered(filteredItems) {
			this.totalRow = filteredItems.length;
      this.currentPage = 1;
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