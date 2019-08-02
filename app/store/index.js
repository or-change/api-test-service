import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	strict: true,
	state: {
		signedIn: false,
		principal: {
			administrator: false,
			name: null,
			id: null
		},
	},
	actions: {
		async signin({ commit }, credential) {
			const principal = await Vue.$http.principal.signin(credential);

			commit('assignPrincipal', {
				name: principal.name,
				administrator: principal.administrator,
				id: principal.id
			});
		},
		async signout({ commit }) {
			return Vue.$http.principal.signout()
				.then(() => {
					commit('resetPrincipal');
				});
		},
		async authenticate({ commit }) {
			const principal = await Vue.$http.principal.get();

			commit('assignPrincipal', {
				name: principal.account.name,
				administrator: principal.account.administrator,
				id: principal.account.id
			});
		}
	},
	mutations: {
		assignPrincipal(state, principal) {
			const { administrator, name, id } = principal;
			
			state.signedIn = true;
			state.principal.administrator = administrator;
			state.principal.name = name;
			state.principal.id = id;
		},
		resetPrincipal(state) {
			state.signedIn = false;
			state.principal.administrator = false;
			state.principal.name = null;
			state.principal.id = null;
		}
	}
});