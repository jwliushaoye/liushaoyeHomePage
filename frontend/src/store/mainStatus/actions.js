import * as types from '../types';

export default {
    //是否显示侧边栏
    isCollapse({commit}){
        commit(types.ISCOLLAPSE);
    },
    // 顶部tab添加
    switchTabAdd({commit} , route){
        commit(types.SWITCHTABARR , route)
    },
    // 删除一个tab
    deleteOneTab({commit}, tabName){
        commit(types.DELETEONTAB , tabName)
    }
}