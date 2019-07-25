import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	strict: true,
	state: {
		signedIn: false,
		principal: {
			administrator: false,
			name: null
		},
	},
	actions: {
		async signin({ commit }, credential) {
			const { data: principal } = await Vue.$http.principal.signin(credential);

			commit('assignPrincipal', {
				name: principal.name,
				administrator: principal.administrator
			});
		},
		async signout({ commit }) {
			Vue.$http.principal.signout();
			commit('resetPrincipal');
		},
		async authenticate({ commit }) {
			const principal = await Vue.$http.principal.get();

			commit('assignPrincipal', {
				name: principal.account.name,
				administrator: principal.account.administrator
			});
		}
	},
	mutations: {
		assignPrincipal(state, principal) {
			const { administrator, name } = principal;

			state.signedIn = true;
			state.principal.administrator = administrator;
			state.principal.name = name;
		},
		resetPrincipal(state) {
			state.signedIn = false;
			state.principal.administrator = false;
			state.principal.name = null;
		}
	}
});