import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

// 全局状态
import state from './mainStatus/states';
import actions from './mainStatus/actions';
import mutations from './mainStatus/mutations';
import getters from './mainStatus/getters';


export default new Vuex.Store({
    state , 
    actions , 
    mutations , 
    getters 
    // modules : {

    // }
})