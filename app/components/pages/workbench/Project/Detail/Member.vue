<template>
	<div>
		<div>
			<label for="keyword" class="align-middle mb-0">关键字搜索：</label>
			<b-form-input
				id="keyword" size="sm" class="d-inline-block align-middle mr-3" style="width: 10em"
				v-model="keyword"
				placeholder="输入搜索关键字"
			></b-form-input>

			<b-input-group class="float-left mr-3 position-relative" size="sm" style="width: 13em">
				<b-form-input
					ref="searchAccount"
					v-model="account.name" @input="getAvaliableAccount"
					@focus="show = true" @blur="show = false"
					placeholder="输入查找用户名"
				></b-form-input>
				<b-input-group-append>
					<b-button variant="primary" :disabled="!account.id" @click="addCollabrator">新增</b-button>
				</b-input-group-append>
				<b-spinner v-if="search" variant="success" small
					class="position-absolute" style="top: .5em;right: 3em;z-index:600"></b-spinner>
				<b-list-group class="position-absolute" style="top: 100%;min-width: 12em" v-show="show">
					<b-list-group-item class="py-1 text-secondary font-size-14" v-if="options.length === 0">暂无符合条件用户</b-list-group-item>
					<b-list-group-item
						class="py-1 font-size-14" v-for="(item, index) in options" @mousedown="account.id = item.value; account.name = item.text; show = false" :key="index">
						{{ item.text }}</b-list-group-item>
				</b-list-group>
			</b-input-group>
			</b-dropdown>
			<b-button size="sm" variant="danger" :disabled="selected.length === 0"
				@click="deleteCollabrator" class="float-right">删除</b-button>
			<b-pagination
				size="sm" class="float-right mr-3 mb-0"
				:total-rows="totalRow" :per-page="perPage"
				v-model="currentPage"
			/>
		</div>

		<custom-table
			class="mt-3"
			:fields="[
				{ label: '标识', key: 'id' },
				{ label: '参与者', key: 'accountId' },
				{ label: '邀请人', key: 'inviter' },
				{ label: '加入时间', 	key: 'joinedAt' }
			]"
			:items="collabratorList"
			:selectable="true"
			sort-by="jointed" :sort-desc="true"
			:per-page="perPage" :current-page="currentPage"
			:filter="keyword" :filter-function="filter" @filtered="onFiltered"
			v-model="selected"
		>
			<template slot="[accountId]" slot-scope="data">
				{{ data.value | accountFormat(accountList) }}
			</template>

			<template slot="[inviter]" slot-scope="data">
				{{ data.value | accountFormat(accountList) }}
			</template>

			<template slot="[joinedAt]" slot-scope="data">
				{{ data.value | dateFormat  }}
			</template>
		</custom-table>
	</div>
</template>

<script>
export default {
	data() {
		return {
			collabratorList: [],
			accountList: [],
			selected: [],
			keyword: '',
			totalRow: 0,
			perPage: 10,
			currentPage: 1,
			account: {
				name: '',
				id: null
			},
			show: false,
			search: false,
			options: [],
			timer: null
		}
	},
	props: {
		projectId: {
			default: ''
		},
		ownerId: {
			default: ''
		}
	},
	filters: {
		accountFormat(value, accountList) {
			const account = accountList.find(account => {
				return value === account.id
			});

			if (account) {
				return account.name;
			}
		}
	},
	methods: {
		onFiltered(filteredItems) {
			this.totalRow = filteredItems.length;
      this.currentPage = 1;
		},
		filter(item, keyword) {
			const regExp = new RegExp(keyword);

			return regExp.test(this.$options.filters.accountFormat(item.accountId, this.accountList))
				|| regExp.test(this.$options.filters.accountFormat(item.inviter, this.accountList));
		},
		getAvaliableAccount() {
			this.search = false;

			if (this.timer) {
				clearTimeout(this.timer);
			}

			if (this.account.name) {
				this.search = true;
				this.timer = setTimeout(async () => {
					const accountList = await this.getAccountList({
						name: this.account.name
					});
	
					const accountIdList = this.collabratorList.map(collabrator => collabrator.accountId);
	
					this.options = accountList
						.filter(account => accountIdList.indexOf(account.id) === -1 && account.id !== this.ownerId)
						.map(account => {
							return { text: account.name, value: account.id };
						});
					this.search = false;
				}, 2000);
			}
		},
		async addCollabrator() {
			await this.$http.project.collabrator(this.projectId).create({
				accountId: this.account.id
			});

			await this.getCollabratorList();

			if (this.timer) {
				clearTimeout(this.timer);
			}
		},
		async getCollabratorList() {
			this.accountList = await this.getAccountList();
			this.collabratorList = await this.$http.project.collabrator(this.projectId).query();
			this.totalRow = this.collabratorList.length;

			this.search = false; this.options = [];
			this.account = {
				id: null, name: ''
			};
		},
		async deleteCollabrator() {
			await Promise.all(this.selected.map(id => {
				return this.$http.project.collabrator(this.projectId).delete(id);
			}));

			await this.getCollabratorList();
			this.selected = [];
		},
		async getAccountList(payload) {
			return await this.$http.account.query(payload);
		}
	},
	mounted() {
		this.getCollabratorList();
	}
}
</script>