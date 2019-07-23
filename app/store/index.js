import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	strict: true,
	state: {
		signedin: false,
		principal: {
			administrator: false,
			name: null
		},
	},
	actions: {
		async signin({ commit }, credential) {
			const { data: principal } = await Vue.$http.signin(credential);

			commit('assignPrincipal', {
				name: principal.name,
				administrator: principal.administrator
			});
		},
		async signout({ commit }) {
			Vue.$http.signout();
			commit('resetPrincipal');
		},
		async authenticate({ commit }) {
			const { data: principal } = await Vue.$http.get();

			commit('assignPrincipal', {
				name: principal.name,
				administrator: principal.administrator
			});
		}
	},
	mutations: {
		assignPrincipal(state, principal) {
			const { administrator, name } = principal;

			state.signedin = true;
			state.principal.administrator = administrator;
			state.principal.name = name;
		},
		resetPrincipal(state) {
			state.signedin = false;
			state.principal.administrator = false;
			state.principal.name = null;
		}
	}
});