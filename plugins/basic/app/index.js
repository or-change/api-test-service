import Vue from 'vue';

import executorPlugin from './executor';
import agentPlugin from './sourceAgent';
import scannerPlugin from './scanner';

Vue.use(executorPlugin);
Vue.use(agentPlugin);
Vue.use(scannerPlugin);