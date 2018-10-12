import * as types from '../types';

export default {
    //是否显示侧边栏
    [types.ISCOLLAPSE](state){
        state.isCollapse = !state.isCollapse;
    },
    // 顶部tab添加  [{name : '' , query : '' , params : ''}]
    [types.SWITCHTABARR](state,value){
        let [tabs , newValue] = [
            state.switchTabArr , 
            {name : value.name , query : value.query , params : value.params , path : value.path}
        ];
        
        if(tabs.length == 0) {
            tabs.push(newValue)
        }else {
            let bl = tabs.map(item => {
                if(item.name == newValue.name){
                    return true;
                }else {
                    return false
                }
            });
            if(!JSON.stringify(bl).includes('true') && newValue.name != '登录'){
                tabs.push(newValue)
            }
        };

        state.switchTabArr = tabs;
    },
    // 删除一个Tab
    [types.DELETEONTAB](state , tabName){
        let del_index = '';
        state.switchTabArr.forEach((item,index) => {
            if(item.name == tabName){
                del_index = index;
                return;
            }
        });
        state.switchTabArr.splice(del_index , 1)
    }
}