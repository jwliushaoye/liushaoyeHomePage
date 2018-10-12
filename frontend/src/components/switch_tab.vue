<template>
    <div class="switch_tab">
        <ul>
            <li v-for="(val,index) in switchTabArr" :key="index" :class="current_route == val.path ? 'active_li' : ''" @click="change_tab(val)">
                <span v-if="current_route == val.path"></span>
                {{val.name}}
                <i class="el-icon-close" @click.stop="delete_tab(val)"></i>
            </li>
        </ul>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        name : 'switch_tab',
        data(){
            return {
                current_route : ''
            }
        },
        created(){
            this.current_route = this.$route.path
        },
        watch:{
            $route(to , from){
                this.current_route = to.path;
            }
        },
        computed : {
            ...mapGetters([
                'switchTabArr'
            ])
        },
        methods: {
            // 切换tab
            change_tab(val){
                this.current_route = val.path;
                this.$router.push({
                    name : val.name,
                    query : val.query ,
                    params : val.params
                })
            },
            // 删除tab
            delete_tab(val){
                this.$store.dispatch('deleteOneTab' , val.name);
                if(this.current_route == val.path){
                    if(this.switchTabArr.length){
                        this.$router.push({
                            name : this.switchTabArr[this.switchTabArr.length - 1].name,
                            query : this.switchTabArr[this.switchTabArr.length - 1].query,
                            params : this.switchTabArr[this.switchTabArr.length - 1].params
                        })
                    }else {
                         this.$router.push({
                             name : '我的首页'
                        })
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .switch_tab{
        height: 34px;
        box-shadow: 0 2px 2px #ccc;
        box-sizing: border-box;
        padding: 3px 15px;
        ul{
            display: flex;
            align-items: center;
            li{
                padding: 5px 10px;
                border: 1px solid #dedede;
                color : #333;
                cursor: pointer;
                font-size: 12px;
                margin-right: 7px;
                display: flex;
                align-items: center;
                >span{
                    display: block;
                    width: 10px;
                    height: 10px;
                    background: #fff;
                    border-radius: 50%;
                    margin-right: 5px;
                }
                >i{
                    width: 16px;
                    height: 16px;
                    transition: .3s;
                    text-align: center;
                    line-height: 16px;
                    margin-left: 5px;
                }
                >i:hover{
                    border-radius: 50%;
                    background: #C0C4CC;
                }
            }   

            .active_li{
                background: #42b983;
                color : #fff;
                border: none;
            }
        }
    }
</style>
